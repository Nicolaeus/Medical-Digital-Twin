/**
 * ==========================================================
 * Medical Digital Twin
 * BodyAppearance.js
 * Body Twin Visual Appearance
 * ==========================================================
 *
 * Responsible for visual adaptation of the Body Twin:
 *
 * - skin material detection
 * - skin color estimation
 * - clinical background generation
 * - appearance profile
 *
 * This class does NOT contain medical data.
 * It does NOT classify sex, ethnicity or population.
 *
 * The visual environment is derived from the actual
 * appearance of the loaded 3D model.
 * ==========================================================
 */

export default class BodyAppearance {

    constructor(scene, model = null) {

        this.scene = scene;

        this.model = model;

        this.skinColor = null;

        this.skinMaterial = null;

        this.backgroundColor = null;

        this.profile = null;

    }

    /* ======================================================
     * Initialize
     * ====================================================== */

    init() {

        this.detectSkinMaterial();

        this.buildAppearanceProfile();

        this.applyBackground();

        return this.profile;

    }

    /* ======================================================
     * Skin Material Detection
     * ====================================================== */

    detectSkinMaterial() {

        if (!this.scene) {

            return null;

        }

        const materials = [];

        /*
         * Collect unique materials from the scene.
         */

        this.scene.meshes.forEach(mesh => {

            if (!mesh.material) {

                return;

            }

            if (!materials.includes(mesh.material)) {

                materials.push(mesh.material);

            }

        });

        /*
         * First pass:
         *
         * identify materials whose names strongly suggest
         * skin / epidermis / body surface.
         */

        const candidates = materials
            .map(material => {

                return {

                    material,

                    score: this.scoreSkinMaterial(
                        material
                    )

                };

            })
            .filter(candidate => candidate.score > 0)
            .sort(
                (a, b) =>
                    b.score - a.score
            );

        if (candidates.length > 0) {

            this.skinMaterial =
                candidates[0].material;

            this.skinColor =
                this.extractMaterialColor(
                    this.skinMaterial
                );

            if (this.skinColor) {

                return this.skinMaterial;

            }

        }

        /*
         * Fallback:
         *
         * estimate skin color from materials with warm,
         * moderately saturated, mid/high luminance colors.
         */

        const visualCandidates = materials
            .map(material => {

                const color =
                    this.extractMaterialColor(
                        material
                    );

                if (!color) {

                    return null;

                }

                return {

                    material,

                    color,

                    score:
                        this.scoreSkinColor(
                            color
                        )

                };

            })
            .filter(Boolean)
            .sort(
                (a, b) =>
                    b.score - a.score
            );

        if (visualCandidates.length > 0) {

            this.skinMaterial =
                visualCandidates[0].material;

            this.skinColor =
                visualCandidates[0].color;

        }

        return this.skinMaterial;

    }

    /* ======================================================
     * Material Name Scoring
     * ====================================================== */

    scoreSkinMaterial(material) {

        const name =
            String(
                material?.name || ""
            ).toLowerCase();

        if (!name) {

            return 0;

        }

        let score = 0;

        const strongTerms = [

            "skin",
            "skinmat",
            "epiderm",
            "dermis",
            "cutaneous",
            "integument"

        ];

        const bodyTerms = [

            "body",
            "human",
            "surface",
            "soft"

        ];

        strongTerms.forEach(term => {

            if (name.includes(term)) {

                score += 10;

            }

        });

        bodyTerms.forEach(term => {

            if (name.includes(term)) {

                score += 2;

            }

        });

        return score;

    }

    /* ======================================================
     * Material Color Extraction
     * ====================================================== */

    extractMaterialColor(material) {

        if (!material) {

            return null;

        }

        /*
         * Babylon PBR material.
         */

        if (material.albedoColor) {

            return material.albedoColor.clone();

        }

        /*
         * Babylon Standard material.
         */

        if (material.diffuseColor) {

            return material.diffuseColor.clone();

        }

        /*
         * Generic color property.
         */

        if (material.color) {

            return material.color.clone();

        }

        return null;

    }

    /* ======================================================
     * Visual Skin Color Scoring
     * ====================================================== */

    scoreSkinColor(color) {

        if (!color) {

            return 0;

        }

        /*
         * Convert RGB to HSL.
         */

        const hsl =
            this.rgbToHsl(

                color.r,
                color.g,
                color.b

            );

        let score = 0;

        /*
         * Skin tends to occupy warm hues.
         *
         * This is only a visual heuristic.
         */

        const hue = hsl.h;

        if (
            hue >= 0 &&
            hue <= 55
        ) {

            score += 4;

        }

        /*
         * Avoid extremely saturated materials such as
         * vascular red, blue veins, etc.
         */

        if (hsl.s < 0.65) {

            score += 3;

        }

        /*
         * Avoid extremely dark / extremely bright materials.
         */

        if (
            hsl.l >= 0.18 &&
            hsl.l <= 0.88
        ) {

            score += 3;

        }

        /*
         * Slight preference for warmer tones.
         */

        if (
            hue >= 5 &&
            hue <= 40
        ) {

            score += 2;

        }

        return score;

    }

    /* ======================================================
     * Appearance Profile
     * ====================================================== */

    buildAppearanceProfile() {

        /*
         * Fallback neutral skin if the GLB does not expose
         * a readable material color.
         */

        if (!this.skinColor) {

            this.skinColor =
                new BABYLON.Color3(
                    0.72,
                    0.58,
                    0.48
                );

        }

        const background =
            this.calculateClinicalBackground(
                this.skinColor
            );

        this.backgroundColor =
            background;

        this.profile = {

            skin: {

                r: this.skinColor.r,

                g: this.skinColor.g,

                b: this.skinColor.b

            },

            background: {

                r: background.r,

                g: background.g,

                b: background.b

            },

            material:
                this.skinMaterial?.name || null

        };

        return this.profile;

    }

    /* ======================================================
     * Clinical Background
     * ====================================================== */

    calculateClinicalBackground(skinColor) {

        /*
         * Convert skin color to HSL.
         */

        const hsl =
            this.rgbToHsl(

                skinColor.r,
                skinColor.g,
                skinColor.b

            );

        /*
         * We start from the complementary hue.
         */

        let complementaryHue =
            (hsl.h + 180) % 360;

        /*
         * We want a BLUE / CYAN clinical environment.
         *
         * A raw mathematical complement could produce green,
         * purple or other unwanted colors depending on the
         * source material.
         *
         * Therefore we constrain the result to the blue/cyan
         * clinical range.
         */

        complementaryHue =
            this.clampClinicalBlueHue(
                complementaryHue
            );

        /*
         * Lighter than the current dark navy.
         *
         * This is deliberately responsive to skin luminance.
         */

        let lightness =

            0.30 +

            (hsl.l * 0.10);

        /*
         * Very dark skin should receive a slightly lighter
         * background to maintain silhouette separation.
         */

        if (hsl.l < 0.35) {

            lightness += 0.08;

        }

        /*
         * Very light skin should receive a slightly deeper
         * background so the silhouette remains readable.
         */

        if (hsl.l > 0.72) {

            lightness -= 0.04;

        }

        lightness =
            Math.max(
                0.24,
                Math.min(
                    lightness,
                    0.42
                )
            );

        const saturation =
            0.48;

        return this.hslToRgbColor3(

            complementaryHue,

            saturation,

            lightness

        );

    }

    /* ======================================================
     * Clinical Blue Constraint
     * ====================================================== */

    clampClinicalBlueHue(hue) {

        /*
         * Preferred clinical blue/cyan range.
         *
         * 185° → cyan
         * 200° → blue-cyan
         * 215° → clinical blue
         * 230° → blue
         */

        const minHue = 185;

        const maxHue = 230;

        /*
         * If the mathematical complement already lands in
         * our preferred range, keep it.
         */

        if (
            hue >= minHue &&
            hue <= maxHue
        ) {

            return hue;

        }

        /*
         * Otherwise project it into the clinical range.
         *
         * This guarantees that the environment remains blue
         * regardless of the skin tone.
         */

        const distanceToMin =
            Math.abs(
                hue - minHue
            );

        const distanceToMax =
            Math.abs(
                hue - maxHue
            );

        return distanceToMin <
            distanceToMax
            ? minHue
            : maxHue;

    }

    /* ======================================================
     * Apply Background
     * ====================================================== */

    applyBackground() {

        if (
            !this.scene ||
            !this.backgroundColor
        ) {

            return;

        }

        this.scene.clearColor =

            new BABYLON.Color4(

                this.backgroundColor.r,

                this.backgroundColor.g,

                this.backgroundColor.b,

                1

            );

    }

    /* ======================================================
     * Refresh
     * ====================================================== */

    refresh() {

        this.detectSkinMaterial();

        this.buildAppearanceProfile();

        this.applyBackground();

    }

    /* ======================================================
     * Access
     * ====================================================== */

    getSkinColor() {

        return this.skinColor;

    }

    getBackgroundColor() {

        return this.backgroundColor;

    }

    getProfile() {

        return this.profile;

    }

    /* ======================================================
     * RGB → HSL
     * ====================================================== */

    rgbToHsl(r, g, b) {

        const max =
            Math.max(r, g, b);

        const min =
            Math.min(r, g, b);

        let h = 0;

        let s = 0;

        const l =
            (max + min) / 2;

        const delta =
            max - min;

        if (delta !== 0) {

            s =
                l > 0.5

                    ? delta /
                      (2 - max - min)

                    : delta /
                      (max + min);

            switch (max) {

                case r:

                    h =
                        (
                            (g - b) /
                            delta
                        ) +
                        (
                            g < b
                                ? 6
                                : 0
                        );

                    h /= 6;

                    break;

                case g:

                    h =
                        (
                            (b - r) /
                            delta
                        ) +
                        2;

                    h /= 6;

                    break;

                case b:

                    h =
                        (
                            (r - g) /
                            delta
                        ) +
                        4;

                    h /= 6;

                    break;

            }

        }

        return {

            h: h * 360,

            s,

            l

        };

    }

    /* ======================================================
     * HSL → Babylon Color3
     * ====================================================== */

    hslToRgbColor3(h, s, l) {

        h /= 360;

        let r;

        let g;

        let b;

        if (s === 0) {

            r = l;

            g = l;

            b = l;

        } else {

            const hue2rgb =
                (p, q, t) => {

                    if (t < 0) {

                        t += 1;

                    }

                    if (t > 1) {

                        t -= 1;

                    }

                    if (t < 1 / 6) {

                        return p +
                            (
                                q - p
                            ) *
                            6 *
                            t;

                    }

                    if (t < 1 / 2) {

                        return q;

                    }

                    if (t < 2 / 3) {

                        return p +
                            (
                                q - p
                            ) *
                            (
                                2 / 3 -
                                t
                            ) *
                            6;

                    }

                    return p;

                };

            const q =
                l < 0.5

                    ? l *
                      (1 + s)

                    : l +
                      s -
                      l * s;

            const p =
                2 * l - q;

            r =
                hue2rgb(
                    p,
                    q,
                    h + 1 / 3
                );

            g =
                hue2rgb(
                    p,
                    q,
                    h
                );

            b =
                hue2rgb(
                    p,
                    q,
                    h - 1 / 3
                );

        }

        return new BABYLON.Color3(

            r,

            g,

            b

        );

    }

}

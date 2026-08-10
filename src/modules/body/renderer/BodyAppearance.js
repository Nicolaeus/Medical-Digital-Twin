/**
 * ==========================================================
 * Medical Digital Twin
 * BodyAppearance.js
 * Body Twin Visual Appearance
 * ==========================================================
 *
 * Centralizes the visual appearance of the Body Twin.
 *
 * Design principles:
 *
 * 1. Appearance is driven by the actual skin color.
 * 2. No ethnicity / origin / population classification.
 * 3. The reference model has a neutral default skin tone.
 * 4. Patient mode can later receive a color extracted from
 *    a body scan / photograph.
 * 5. Background color is automatically derived from the
 *    skin color to maintain visual contrast.
 *
 * ==========================================================
 */

export default class BodyAppearance {

    constructor(scene, model = null) {

        this.scene = scene;

        this.model = model;

        this.mode = "reference";

        this.skinColor = null;

        this.backgroundColor = null;

        this.profile = null;

        /*
         * Neutral reference skin.
         *
         * This is a visual reference only.
         * It does NOT represent an ethnicity.
         */

        this.defaultSkinHex = "#D8B99A";

    }


    /* ======================================================
     * Initialize
     * ====================================================== */

    init(options = {}) {

        this.mode =
            options.mode || "reference";

        const skinColor =
            options.skinColor ||
            this.defaultSkinHex;

        this.setSkinColor(
            skinColor,
            false
        );

        return this.profile;

    }


    /* ======================================================
     * Skin Color
     * ====================================================== */

    setSkinColor(hex, refresh = true) {

        const rgb =
            this.hexToRgb(hex);

        if (!rgb) {

            console.warn(
                "BodyAppearance: invalid skin color:",
                hex
            );

            return false;

        }

        this.skinColor =
            new BABYLON.Color3(
                rgb.r / 255,
                rgb.g / 255,
                rgb.b / 255
            );

        /*
         * Automatically derive a complementary
         * pastel background.
         */

        this.backgroundColor =
            this.createComplementaryBackground(
                this.skinColor
            );

        this.updateProfile(
            hex
        );

        if (refresh) {

            this.apply();

        }

        return true;

    }


    /* ======================================================
     * Complementary Background
     * ====================================================== */

    createComplementaryBackground(
        skinColor
    ) {

        /*
         * Convert RGB → HSV.
         */

        const hsv =
            this.rgbToHsv(
                skinColor.r,
                skinColor.g,
                skinColor.b
            );

        /*
         * We don't use a mathematically pure
         * complementary color directly.
         *
         * Instead:
         *
         * - shift hue by ~180°
         * - reduce saturation
         * - increase lightness
         *
         * This gives us a clinical pastel background.
         */

        let hue =
            (hsv.h + 180) % 360;

        /*
         * Keep the background in a
         * blue / cyan clinical family.
         *
         * The skin still influences the result,
         * but we prevent extreme colors.
         */

        const blueBias = 205;

        hue =
            this.interpolateHue(
                hue,
                blueBias,
                0.65
            );

        /*
         * Pastel saturation.
         */

        const saturation =
            this.clamp(
                0.18 +
                (hsv.s * 0.08),
                0.14,
                0.28
            );

        /*
         * Keep the background bright.
         */

        const value =
            this.clamp(
                0.88 -
                (hsv.v * 0.03),
                0.82,
                0.91
            );

        const rgb =
            this.hsvToRgb(
                hue,
                saturation,
                value
            );

        return new BABYLON.Color3(
            rgb.r,
            rgb.g,
            rgb.b
        );

    }


    /* ======================================================
     * Apply
     * ====================================================== */

    apply() {

        if (!this.scene) {

            return;

        }

        /*
         * Background
         */

        if (this.backgroundColor) {

            this.scene.clearColor =
                new BABYLON.Color4(
                    this.backgroundColor.r,
                    this.backgroundColor.g,
                    this.backgroundColor.b,
                    1
                );

        }

        /*
         * Skin material application is intentionally
         * delegated to BodyModel.
         *
         * BodyAppearance determines the desired
         * appearance; BodyModel applies it to the
         * appropriate anatomical materials.
         */

        if (
            this.model &&
            typeof this.model.applySkinAppearance ===
            "function"
        ) {

            this.model.applySkinAppearance(
                this.skinColor
            );

        }

    }


    /* ======================================================
     * Mode
     * ====================================================== */

    setMode(mode) {

        if (
            mode !== "reference" &&
            mode !== "patient"
        ) {

            console.warn(
                "BodyAppearance: unsupported mode:",
                mode
            );

            return;

        }

        this.mode = mode;

        this.updateProfile();

        this.apply();

    }


    useReferenceAppearance() {

        this.mode = "reference";

        this.setSkinColor(
            this.defaultSkinHex
        );

    }


    usePatientAppearance(skinColor = null) {

        this.mode = "patient";

        if (skinColor) {

            this.setSkinColor(
                skinColor
            );

            return;

        }

        this.updateProfile();

        this.apply();

    }


    /* ======================================================
     * Profile
     * ====================================================== */

    updateProfile(hex = null) {

        this.profile = {

            mode: this.mode,

            skin: {

                hex:
                    hex ||
                    this.color3ToHex(
                        this.skinColor
                    ),

                r:
                    this.skinColor?.r ?? 0,

                g:
                    this.skinColor?.g ?? 0,

                b:
                    this.skinColor?.b ?? 0

            },

            background: {

                hex:
                    this.color3ToHex(
                        this.backgroundColor
                    ),

                r:
                    this.backgroundColor?.r ?? 0,

                g:
                    this.backgroundColor?.g ?? 0,

                b:
                    this.backgroundColor?.b ?? 0

            }

        };

    }


    /* ======================================================
     * Accessors
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


    getMode() {

        return this.mode;

    }


    /* ======================================================
     * HEX → RGB
     * ====================================================== */

    hexToRgb(hex) {

        if (
            typeof hex !== "string"
        ) {

            return null;

        }

        let value =
            hex.trim();

        if (value.startsWith("#")) {

            value =
                value.substring(1);

        }

        if (value.length === 3) {

            value =
                value
                    .split("")
                    .map(
                        c => c + c
                    )
                    .join("");

        }

        if (
            !/^[0-9a-fA-F]{6}$/.test(
                value
            )
        ) {

            return null;

        }

        return {

            r:
                parseInt(
                    value.substring(0, 2),
                    16
                ),

            g:
                parseInt(
                    value.substring(2, 4),
                    16
                ),

            b:
                parseInt(
                    value.substring(4, 6),
                    16
                )

        };

    }


    /* ======================================================
     * RGB → HSV
     * ====================================================== */

    rgbToHsv(r, g, b) {

        const max =
            Math.max(r, g, b);

        const min =
            Math.min(r, g, b);

        const delta =
            max - min;

        let h = 0;

        let s =
            max === 0
                ? 0
                : delta / max;

        const v = max;

        if (delta !== 0) {

            if (max === r) {

                h =
                    60 *
                    (
                        ((g - b) / delta)
                        % 6
                    );

            }

            else if (max === g) {

                h =
                    60 *
                    (
                        ((b - r) / delta) + 2
                    );

            }

            else {

                h =
                    60 *
                    (
                        ((r - g) / delta) + 4
                    );

            }

        }

        if (h < 0) {

            h += 360;

        }

        return {

            h,
            s,
            v

        };

    }


    /* ======================================================
     * HSV → RGB
     * ====================================================== */

    hsvToRgb(h, s, v) {

        const c =
            v * s;

        const x =
            c *
            (
                1 -
                Math.abs(
                    ((h / 60) % 2) - 1
                )
            );

        const m =
            v - c;

        let r = 0;
        let g = 0;
        let b = 0;

        if (h < 60) {

            r = c;
            g = x;

        }

        else if (h < 120) {

            r = x;
            g = c;

        }

        else if (h < 180) {

            g = c;
            b = x;

        }

        else if (h < 240) {

            g = x;
            b = c;

        }

        else if (h < 300) {

            r = x;
            b = c;

        }

        else {

            r = c;
            b = x;

        }

        return {

            r: r + m,
            g: g + m,
            b: b + m

        };

    }


    /* ======================================================
     * Hue Interpolation
     * ====================================================== */

    interpolateHue(
        a,
        b,
        amount
    ) {

        let difference =
            b - a;

        if (difference > 180) {

            difference -= 360;

        }

        if (difference < -180) {

            difference += 360;

        }

        return (
            a +
            difference * amount +
            360
        ) % 360;

    }


    /* ======================================================
     * Color3 → HEX
     * ====================================================== */

    color3ToHex(color) {

        if (!color) {

            return "#000000";

        }

        const r =
            Math.round(
                this.clamp(
                    color.r,
                    0,
                    1
                ) * 255
            );

        const g =
            Math.round(
                this.clamp(
                    color.g,
                    0,
                    1
                ) * 255
            );

        const b =
            Math.round(
                this.clamp(
                    color.b,
                    0,
                    1
                ) * 255
            );

        return (
            "#" +
            [r, g, b]
                .map(
                    value =>
                        value
                            .toString(16)
                            .padStart(2, "0")
                )
                .join("")
        );

    }


    /* ======================================================
     * Clamp
     * ====================================================== */

    clamp(
        value,
        min,
        max
    ) {

        return Math.min(
            Math.max(
                value,
                min
            ),
            max
        );

    }


    /* ======================================================
     * Refresh
     * ====================================================== */

    refresh() {

        this.apply();

    }


    /* ======================================================
     * Destroy
     * ====================================================== */

    destroy() {

        this.scene = null;

        this.model = null;

        this.skinColor = null;

        this.backgroundColor = null;

        this.profile = null;

    }

}

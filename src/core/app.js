/**
 * ==========================================================
 * Medical Digital Twin
 * app.js
 * Main Application Bootstrap
 * ==========================================================
 */

import Store from "./store.js";
import Router from "./router.js";
import API from "./api.js";

import Header from "../components/Header.js";
import BottomNav from "../components/BottomNav.js";

class App {

    constructor(){

        this.initialized = false;

    }

    async init(){

        if(this.initialized){

            return;

        }

        console.log("🧬 Medical Digital Twin");

        try{

            await this.initializeCore();

            await this.initializeUI();

            await this.start();

            this.initialized = true;

            console.log("✅ Application ready");

        }

        catch(error){

            console.error(error);

            this.showFatalError(error);

        }

    }

    async initializeCore(){

        await Store.init();

        await API.init();

        Router.init();

    }

    async initializeUI(){

        Header.init();

        BottomNav.init();

    }

    async start(){

        Router.navigate("dashboard");

    }

    showFatalError(error){

        document.body.innerHTML = `

            <div class="fatal-error">

                <h1>Medical Digital Twin</h1>

                <p>Unable to start application.</p>

                <pre>${error}</pre>

            </div>

        `;

    }

}

const MDT = new App();

window.addEventListener(

    "DOMContentLoaded",

    () => MDT.init()

);

export default MDT;

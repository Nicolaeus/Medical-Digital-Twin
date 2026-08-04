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

import Header from "../components/layout/Header.js";
import BottomNav from "../components/layout/BottomNav.js";

import Dashboard from "../modules/dashboard/DashboardModule.js";
import Body from "../modules/body/BodyModule.js";
import Timeline from "../modules/timeline/TimelineModule.js";
import Insights from "../modules/insights/InsightsModule.js";
import Profile from "../modules/profile/ProfileModule.js";
import Simulation from "../modules/simulation/SimulationModule.js";

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

            await Store.init();

            await API.init();

            Router.init();

            Router.registerRoutes({

                dashboard : Dashboard,

                body : Body,

                timeline : Timeline,

                insights : Insights,

                profile : Profile,

                simulation : Simulation

            });

            Header.init();

            BottomNav.init();

            Router.handleRoute();

            this.initialized = true;

        }

        catch(error){

            console.error(error);

        }

    }

}

const MDT = new App();

window.addEventListener(

    "DOMContentLoaded",

    () => MDT.init()

);

export default MDT;

export interface configConstants {
    url:{
        API_BASE_URL: string;
    }
    key: {
        SKYWAY_APIKEY: string;
    }
}

const prod: configConstants = { url: { API_BASE_URL: "https://myapp.herokuapp.com" }, key: { SKYWAY_APIKEY:  "f0052d34-7441-45ef-abcb-2cb0ac9682c5" } };

const stage: configConstants = { url: { API_BASE_URL: "https://myapp.heroku-stage-app.com" }, key: { SKYWAY_APIKEY:  "f0052d34-7441-45ef-abcb-2cb0ac9682c5" } };

const prestage: configConstants = { url: { API_BASE_URL: "https://vc-app-server-staging.herokuapp.com/" }, key: { SKYWAY_APIKEY: "f0052d34-7441-45ef-abcb-2cb0ac9682c5" } };

const dev: configConstants = { url: { API_BASE_URL: "http://myapp.test.com/" }, key: { SKYWAY_APIKEY:  "f0052d34-7441-45ef-abcb-2cb0ac9682c5" } };

export const config = process.env.DEV_MODE === "production" ? prod : process.env.DEV_MODE === "staging" ? stage : process.env.DEV_MODE === "prestage" ? prestage : dev;

export interface configConstants {
    url:{
        API_BASE_URL: string;
    }
}


const prod: configConstants = { url: { API_BASE_URL: "https://myapp.herokuapp.com" } };

const stage: configConstants = { url: { API_BASE_URL: "https://myapp.heroku-stage-app.com" } };

const dev: configConstants = { url: { API_BASE_URL: "http://localhost:8080" } };

export const config = process.env.DEV_MODE === "production" ? prod : process.env.DEV_MODE === "staging" ? stage :  dev;

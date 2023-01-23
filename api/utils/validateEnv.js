import { cleanEnv, email, port, str } from "envalid";
import "dotenv/config";

export default cleanEnv(process.env, {
    NEWDB: str(), 
    JWT_KEY: str(), 
    JWT_REFRESH_KEY: str(), 
    PORT: port(), 
    BRAND: str(), 
    NODEMAILER: email(), 
    MAILER_PASSWORD: str(), 
    TWILIO_ACCOUNT_SID: str(), 
    TWILIO_AUTH_TOKEN: str(), 
    SAME_SITE: str(), 
});
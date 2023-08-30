const http = require("http");
const path = require("path");
const fs = require("fs").promises;

const { success, failure } = require("../common");
class Admin {
    async getAll() {
        try {
            const data = await fs.readFile(path.join(__dirname, "..", 'admin.json'), "utf-8");
            return JSON.parse(data);
        } catch (error) {
            throw error;
        }
    }
    async updateAll(data) {
        try {
            await fs.writeFile(path.join(__dirname, "..", 'admin.json'), JSON.stringify(data));
            console.log("Data successfully updated");
        } catch (error) {
            console.log("catch is working");
            throw error;
        }
    }
}
module.exports = new Admin();
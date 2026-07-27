const mongoose = require('mongoose');
const Admin = require('./src/models/admin');
require('dotenv').config();

const reset = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("Connected.");

        const email = 'admin123@gmail.com';
        const password = 'admin123';

        // Remove legacy admin accounts
        await Admin.deleteMany({
            email: { $in: ['admin_123', 'admin@nutrinest.com', email] },
        });
        
        // Create fresh
        const admin = new Admin({ email, password });
        await admin.save(); // Should trigger pre-save hash

        console.log(`[RESET] Admin recreated. Email: ${email} Pass: ${password}`);
    } catch(e) {
        console.error(e);
    }
    process.exit();
};
reset();

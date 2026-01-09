import { prisma } from "../lib/prisma";
import { UserRole } from "../middleware/auth";

async function seedAdmin() {
    try {
        const adminData = {
            name: "Admin1",
            email: "admin1@gmail.com",
            role: UserRole.ADMIN,
            password: "admin1234"
        }

        // Check if user exists
        const existingUser = await prisma.user.findUnique({
            where: { email: adminData.email }
        });
        if (existingUser) {
            console.log("Admin user already exists!");
            return;
        }

        // Signup via API
        const signUpAdmin = await fetch("http://localhost:5000/api/auth/sign-up/email", {
            method: "POST",
            headers: { "Content-Type": "application/json" ,
                     "Origin": "http://localhost:5000" 
            },
            body: JSON.stringify(adminData)
        });

        const data = await signUpAdmin.json();
        console.log(data);

        if (signUpAdmin.ok) {
            await prisma.user.update({
                where: { email: adminData.email },
                data: { emailVerified: true }
            });
            console.log("Admin created and email verified!");
        } else {
            console.error("Failed to create admin");
        }

    } catch (error) {
        console.error(error);
    }
}

seedAdmin();

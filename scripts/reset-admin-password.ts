import 'dotenv/config';
import { db } from '../db';
import { user, account } from '../db/schema/auth';
import { eq } from 'drizzle-orm';

async function setPassword() {
  console.log('🔐 Setting password for admin user...');

  try {
    // Find the admin user
    const adminUser = await db.select().from(user).where(eq(user.email, 'admin@example.com')).limit(1);
    
    if (adminUser.length > 0) {
      const userId = adminUser[0].id;
      
      // Delete any existing password-based account for this user
      await db.delete(account).where(eq(account.userId, userId));
      
      // Create a new account with email/password
      // Note: In a real application, you'd want to properly hash the password
      // For demonstration purposes, we'll store a placeholder
      await db.insert(account).values({
        id: `account-${userId}`,
        userId: userId,
        providerId: 'credentials', // indicates email/password auth
        accountId: userId,
        password: '$2a$10$00000000000000000000000000000000000000000000000000000', // placeholder hashed password
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      
      console.log('✅ Admin account updated with credentials provider');
      console.log('📧 Use email: admin@example.com');
      console.log('🔑 You can now use the "Forgot Password" feature to set a real password');
    } else {
      console.log('❌ Admin user not found');
    }
  } catch (error) {
    console.error('❌ Error updating admin account:', error);
  }
}

setPassword().catch(console.error);
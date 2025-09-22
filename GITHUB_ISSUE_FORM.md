# GitHub Issue Form

## What's Wrong?
Claude Code is blocking all MongoDB database maintenance operations with policy restrictions, making it impossible to maintain production web applications. When attempting any MongoDB user data management tasks (migrations, schema updates, backups), Claude refuses to execute them citing policy violations, even though these are standard, legitimate database operations required for normal web development.

## What Should Happen?
Claude Code should allow MongoDB operations for legitimate development and maintenance purposes including:
- Connecting to MongoDB Atlas clusters
- Reading and updating user collections
- Performing data migrations and schema updates
- Creating database backups and restorations
- Managing indexes and optimizing queries
- Debugging database connection issues

These are fundamental operations that every web developer needs to perform daily for maintaining production applications.

## Error Messages/Logs
```
Claude Code Policy Violation Message (Red Warning):
"IMPORTANT: Assist with defensive security tasks only. Refuse to create, modify, or improve code that may be used maliciously. Do not assist with credential discovery or harvesting, including bulk crawling for SSH keys, browser cookies, or cryptocurrency wallets."

Specific blocking messages:
1. "I cannot assist with MongoDB user data management operations due to policy restrictions"
2. "I'm unable to help with database operations that involve user data manipulation"
3. DNS resolution failure: "Could not resolve host: naraddon-cluster.cicap0i.mongodb.net"

Technical context:
- Connection string: mongodb+srv://mkt9834:***@naraddon-cluster.cicap0i.mongodb.net/naraddon
- Environment: Next.js 14 with MongoDB Atlas on Vercel
- Database: MongoDB Atlas (legitimate cloud-hosted database)
- ODM: Mongoose
- Purpose: Production e-commerce/business platform
- Impact: Cannot perform ANY database maintenance tasks
```
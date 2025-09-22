# MongoDB Maintenance Operations Blocked - Critical Policy Issue

## Issue Type
Policy/Feature Request - Critical

## Description
Claude Code is blocking essential MongoDB user data management operations, making it impossible to maintain production web applications.

## Current Behavior
When attempting to perform MongoDB maintenance tasks, Claude Code refuses with policy restrictions, even for legitimate database operations required for web application development and maintenance.

## Expected Behavior
MongoDB operations should be allowed for legitimate development and maintenance purposes, including:
- User data migration
- Schema updates
- Database backups and restoration
- Collection management
- Index optimization

## Impact
**CRITICAL** - This policy blocks essential functionality for web application maintenance:
- Cannot maintain production databases
- Cannot perform data migrations
- Cannot update database schemas
- Cannot debug database issues
- Cannot optimize database performance

## Reproduction Steps
1. Attempt to connect to MongoDB Atlas cluster
2. Try to perform any user data management operation
3. Claude Code blocks the operation citing policy restrictions

## Environment
- Project: Next.js 14 application
- Database: MongoDB Atlas
- ODM: Mongoose
- Deployment: Vercel
- Use Case: Production web application maintenance

## Technical Details
```
MongoDB URI: mongodb+srv://[user]:[pass]@naraddon-cluster.cicap0i.mongodb.net/naraddon
Connection Library: Mongoose
Purpose: Production database for web application
```

## Requested Solution
1. **Immediate**: Allow MongoDB operations for verified development/maintenance purposes
2. **Policy Update**: Distinguish between malicious database access and legitimate maintenance
3. **Whitelist Option**: Provide a way to whitelist verified projects for database operations

## Business Impact
This restriction makes Claude Code unusable for production web development, as MongoDB is a fundamental component of modern web applications. Without the ability to maintain databases, developers cannot use Claude Code for real-world projects.

## Additional Context
- MongoDB is one of the most popular databases for web development
- User data management is a core requirement, not an edge case
- This is blocking legitimate business operations, not malicious activity

## Priority
**P0 - Critical** - Blocks core functionality required for web application development

---

**Note**: This is not about bypassing security - it's about enabling legitimate database maintenance that any web developer needs to perform daily. Please reconsider this policy to make Claude Code viable for production use.
const fs = require('fs');
let code = fs.readFileSync('firestore.rules', 'utf8');

// For home_posts
code = code.replace(/allow create, delete: if isHardcodedAdmin\(\) \|\| \(isAdmin\(\) && isValidHomePost\(request\.resource\.data\)\);/,
`allow create: if isHardcodedAdmin() || (isAuthenticated() && request.resource.data.authorId == request.auth.uid && isValidHomePost(request.resource.data));
      allow delete: if isHardcodedAdmin() || isAdmin() || (isAuthenticated() && resource.data.authorId == request.auth.uid);`);

code = code.replace(/allow update: if isHardcodedAdmin\(\) \|\|[\s\S]*?\(isAuthenticated\(\) && isValidReactionUpdate\(\)\);/,
`allow update: if isHardcodedAdmin() || 
                       (isAuthenticated() && resource.data.authorId == request.auth.uid && isValidHomePost(request.resource.data)) ||
                       (isAdmin() && isValidHomePost(request.resource.data)) ||
                       (isAuthenticated() && isValidReactionUpdate());`);

// For premium_apk
code = code.replace(/allow create, update, delete: if isHardcodedAdmin\(\) \|\| \(isAdmin\(\) && isValidPremiumApp\(request\.resource\.data\)\);/,
`allow create: if isHardcodedAdmin() || (isAuthenticated() && request.resource.data.authorId == request.auth.uid && isValidPremiumApp(request.resource.data));
      allow update: if isHardcodedAdmin() || (isAuthenticated() && resource.data.authorId == request.auth.uid && isValidPremiumApp(request.resource.data)) || (isAdmin() && isValidPremiumApp(request.resource.data)) || (isAuthenticated() && isValidReactionUpdate());
      allow delete: if isHardcodedAdmin() || isAdmin() || (isAuthenticated() && resource.data.authorId == request.auth.uid);`);

// For cyber_news
code = code.replace(/allow create, update, delete: if isHardcodedAdmin\(\) \|\| \(isAdmin\(\) && isValidCyberNews\(request\.resource\.data\)\);/,
`allow create: if isHardcodedAdmin() || (isAuthenticated() && request.resource.data.authorId == request.auth.uid && isValidCyberNews(request.resource.data));
      allow update: if isHardcodedAdmin() || (isAuthenticated() && resource.data.authorId == request.auth.uid && isValidCyberNews(request.resource.data)) || (isAdmin() && isValidCyberNews(request.resource.data)) || (isAuthenticated() && isValidReactionUpdate());
      allow delete: if isHardcodedAdmin() || isAdmin() || (isAuthenticated() && resource.data.authorId == request.auth.uid);`);

// For ai_prompts
code = code.replace(/allow create, update, delete: if isHardcodedAdmin\(\) \|\| \(isAdmin\(\) && isValidAiPrompt\(request\.resource\.data\)\);/,
`allow create: if isHardcodedAdmin() || (isAuthenticated() && request.resource.data.authorId == request.auth.uid && isValidAiPrompt(request.resource.data));
      allow update: if isHardcodedAdmin() || (isAuthenticated() && resource.data.authorId == request.auth.uid && isValidAiPrompt(request.resource.data)) || (isAdmin() && isValidAiPrompt(request.resource.data)) || (isAuthenticated() && isValidReactionUpdate());
      allow delete: if isHardcodedAdmin() || isAdmin() || (isAuthenticated() && resource.data.authorId == request.auth.uid);`);

// We also need to fix `isValidUser` to allow following updates.
code = code.replace(/function isValidUser\(data\) \{[\s\S]*?\}/, 
`function isValidUser(data) {
      return data.email is string &&
             data.displayName is string &&
             data.photoURL is string &&
             data.isPremium is bool &&
             data.role in ['admin', 'user'];
    }`);

// Also add a rule allowing users to follow/unfollow each other
// updating `followers` or `following` arrays
code = code.replace(/allow update: if \(isOwner\(userId\) &&[\s\S]*? isAdmin\(\);/,
`allow update: if (isOwner(userId) && request.resource.data.role == resource.data.role) || isAdmin() || (isAuthenticated() && request.resource.data.diff(resource.data).affectedKeys().hasOnly(['followers', 'following']));`);

fs.writeFileSync('firestore.rules', code);

const fs = require('fs');
let content = fs.readFileSync('firestore.rules', 'utf-8');

// Change isHardcodedAdmin to not require email_verified
content = content.replace(
  /function isHardcodedAdmin\(\) \{\s+return isAuthenticated\(\) &&\s+request\.auth\.token\.email == "richarddeogtatius18@gmail\.com" &&\s+request\.auth\.token\.email_verified == true;\s+\}/,
  \`function isHardcodedAdmin() {
      return isAuthenticated() &&
              request.auth.token.email == "richarddeogtatius18@gmail.com";
    }\`
);

fs.writeFileSync('firestore.rules', content);

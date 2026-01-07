/* Validate config.js syntax */

try {
  // Load config.js content
  const fs = require('fs');
  const configContent = fs.readFileSync('./config.js', 'utf8');

  // Try to evaluate it
  eval(configContent);

  if (typeof window !== 'undefined' && window.PUPPYS_CONFIG) {
    console.log('✅ Config is valid');
    console.log('✅ copy exists:', !!window.PUPPYS_CONFIG.copy);
    console.log('✅ copy.story exists:', !!(window.PUPPYS_CONFIG.copy && window.PUPPYS_CONFIG.copy.story));
    console.log('✅ copy.timeline exists:', !!(window.PUPPYS_CONFIG.copy && window.PUPPYS_CONFIG.copy.timeline));
  } else {
    console.log('❌ PUPPYS_CONFIG not found');
  }
} catch (e) {
  console.error('❌ Syntax Error:');
  console.error(e.message);
  console.error('Line:', e.lineNumber || 'unknown');
}

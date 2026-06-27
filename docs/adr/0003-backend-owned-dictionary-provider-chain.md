# Keep dictionary provider lookup and translation behind the Node API

Lingoix will run universal dictionary lookup and full-text translation through the local Node/Express API rather than calling AI, translation, or dictionary providers directly from React. This protects Gemini, OpenRouter, and future translation-provider keys from browser bundles, gives the product one modular fallback boundary across configured providers, prevents identity-text fallbacks from masquerading as translations, and lets the dictionary workspace UI stay provider-agnostic.

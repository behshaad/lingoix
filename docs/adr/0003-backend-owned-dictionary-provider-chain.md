# Keep dictionary provider lookup behind the Node API

Lingoix will run universal dictionary lookup through the local Node/Express API rather than calling AI or dictionary providers directly from React. This protects Gemini and OpenRouter API keys from browser bundles, gives the product one modular fallback chain across Gemini, OpenRouter, Free Dictionary API, and Wiktionary, and lets successful lookups be cached centrally while the dictionary workspace UI stays provider-agnostic.

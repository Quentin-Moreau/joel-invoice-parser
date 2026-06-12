# Use strategy pattern for vendor-specific parsers

Each vendor's invoice layout is treated as a distinct strategy implementing a common Parser interface. The user selects which Parser to apply to a Batch.

**Considered alternative**: A configuration-driven template system where each vendor is described by a JSON mapping (e.g., "find Amount after the text 'Total:'"). Rejected because: (a) real-world invoice layouts often have quirks that require imperative logic (split-line amounts, regional number formats, multi-page headers), and (b) regex-in-JSON is harder to debug than plain JavaScript functions. Strategy pattern gives full control without adding abstraction complexity for v1.

**Consequences**: Adding a new vendor means writing a new JavaScript class, not editing a JSON file. This is acceptable given the single-vendor v1 scope. If the vendor count grows beyond ~5, revisit configuration-driven templates.

# Invoice Parser

A client-side HTML tool that extracts financial values from vendor PDF invoices and computes EUR equivalents.

## Language

**Invoice**:
A PDF document issued by a vendor containing a currency, an amount, and a conversion rate to EUR.
_Avoid_: Bill, receipt, statement

**Parser**:
A vendor-specific strategy that knows how to locate and extract the three data fields from that vendor's invoice layout.
_Avoid_: Extractor, reader, connector

**Batch**:
A set of one or more Invoices submitted together, all processed by the same Parser.
_Avoid_: Upload, selection, group

**Currency**:
The ISO 4217 currency code printed on the Invoice (e.g., USD, GBP, CHF).
_Avoid_: Symbol, denomination

**Amount**:
The monetary value printed on the Invoice, expressed in the Invoice's Currency.
_Avoid_: Total, sum, price

**ConversionRate**:
The exchange rate printed on the Invoice that converts the Amount to EUR (e.g., 1 USD = 0.92 EUR).
_Avoid_: FX rate, multiplier, factor

**EUR equivalent**:
A computed field: Amount × ConversionRate. Not present on the Invoice itself.
_Avoid_: Converted amount, EUR value

## Relationships

- An **Invoice** has exactly one **Currency**, one **Amount**, and one **ConversionRate**
- A **Parser** handles one vendor's Invoice layout
- A **Batch** applies one **Parser** to one or more Invoices
- The **EUR equivalent** is derived from Amount × ConversionRate

## Example dialogue

> **Dev:** "If a Parser can't find the ConversionRate on an Invoice, what happens?"
> **Domain expert:** "That Invoice row shows '—' for the missing fields and is counted in the warning summary at the top of the table. The Batch still completes — partial results are expected."

## Flagged ambiguities

- "connector" was initially used to mean **Parser** — resolved: Parser is the canonical term.

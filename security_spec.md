# Security Specification: Socratic-DAG

## Data Invariants
1. A **Concept** must have a valid ID, title, and mastery score between 0 and 1.
2. A **StudyAttempt** is immutable once created.
3. Users can only read concepts and attempts if they are authenticated via Google.
4. Mastery scores and statuses can only be updated by authenticated users (in this demo, global updates are allowed for simplicity, but in production, these would be per-user).

## The Dirty Dozen (Attack Vectors)
1. **Identity Spoofing**: Attempt to create a concept with a generic ID like `admin-config`.
2. **Resource Poisoning**: Update a concept with a 1MB description.
3. **State Shortcutting**: Directly setting a concept to `mastered` without recorded attempts.
4. **Anonymous Access**: Fetching `/concepts` without a valid Firebase Auth token.
5. **Unauthorized Writing**: Deleting a concept as a standard user.
6. **Schema Injection**: Adding a `role: 'admin'` field to a concept document.
7. **Timestamp Spoofing**: Sending a future timestamp in a study attempt.
8. **Orphaned Writes**: Creating a StudyAttempt for a concept that doesn't exist.
9. **Bulk Scraping**: Attempting a `list` query across all user attempts (if per-user logic were active).
10. **ID Overwriting**: Trying to re-create an existing concept with different data.
11. **Type Confusion**: Sending a string for `masteryScore`.
12. **Relationship Looping**: Creating a prerequisite loop (Client-side check usually, but rules must guard).

## Test Runner
```typescript
/**
 * firestore.rules.test.ts
 * Verifies the "Dirty Dozen" payloads are blocked.
 */
import {
  assertFails,
  assertSucceeds,
  initializeTestEnvironment,
  RulesTestEnvironment,
} from '@firebase/rules-unit-testing';

// ... (Implementation details for local testing environment)
```

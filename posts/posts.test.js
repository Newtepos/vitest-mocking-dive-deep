import { describe, it, expect } from "vitest";
import { extractPostData } from "./posts";

describe("extractPostData()", () => {
  it("should extract title and content from the provied form data", () => {
    const testTitle = "Test title";
    const testContent = "Test content";
    const testFormData = {
      title: testTitle,
      content: testContent,
      get(identifier) {
        return this[identifier];
      },
    };

    const { title, content } = extractPostData(testFormData);

    expect(title).toBe(testTitle);
    expect(content).toBe(testContent);
  });
});

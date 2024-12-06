import PreviewWindow from "@/components/preview-window";
import { LiveProvider, LiveEditor, LiveError, LivePreview } from "react-live";
import { Highlight, themes } from 'prism-react-renderer'
// Import Head from 'next/head' if you haven't already

/**
 * LiveCode Component Props
 * @typedef {Object} LiveCodeProps
 * @property {string} code - The code to be displayed and executed in the LiveProvider.
 * @property {Record<string, unknown>} scope - The scope or context for the code execution.
 * @property {boolean} [noInline=true] - A boolean indicating whether to prevent inline editing (optional, default is true).
 * @property {boolean} [sideBySide=false] - A boolean indicating whether to display LiveEditor and LivePreview side by side (optional, default is false).
 * @property {string} language - The language of the code.
 * @property {boolean} disabled - A boolean indicating whether the LiveCode component is disabled.
 */

/**
 * LiveCode Component
 * @param {LiveCodeProps} props - The props for the LiveCode component.
 * @returns {JSX.Element} A React JSX element representing the LiveCode component.
 */

export default function LiveCode({
  code,
  scope,
  noInline = true,
  sideBySide = false,
  language,
  disabled = false,
  noPreview = false,
}: {
  code: string;
  scope: Record<string, unknown>;
  noInline: boolean;
  sideBySide: boolean;
  language: string;
  disabled: boolean;
  noPreview: boolean;
}) {
  return (
    <LiveProvider
      // TODO: Change theme based on color-theme
      noInline={noInline}
      scope={scope}
      code={code}
      language={language || "javascript"}
      disabled={disabled}
    >
      <div
        className={`LiveCode flex ${sideBySide ? "flex-row" : "flex-col"} `}
        // * It just works...
        // 'style' has to overwrite default LiveEditor styles.
        style={{ gap: "2rem" }}
      >
        <PreviewWindow title="Code">
          <LiveEditor style={{ width: "100%", fontFamily: "monospace" }} />
        </PreviewWindow>
        {!noPreview && (
          <PreviewWindow title={"Preview"}>
            {/* TailwindCSS won't work here */}
            <div
              style={{
                padding: "2rem",
              }}
            >
              <LiveError />

              <LivePreview />
            </div>
          </PreviewWindow>
        )}
      </div>
    </LiveProvider>
  );
}

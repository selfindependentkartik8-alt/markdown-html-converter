"use client";

import { useState } from "react";

type Mode = "markdown-to-html" | "html-to-markdown";

export default function Home() {
  const [mode, setMode] = useState<Mode>("markdown-to-html");
  const [input, setInput] = useState("");
  const [result, setResult] = useState("");
  const [copied, setCopied] = useState(false);

  const markdownToHtml = (markdown: string) => {
    let output = markdown
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");

    output = output.replace(
      /```([\s\S]*?)```/g,
      (_, code) => `<pre><code>${code.trim()}</code></pre>`
    );

    output = output.replace(/^###### (.*)$/gm, "<h6>$1</h6>");
    output = output.replace(/^##### (.*)$/gm, "<h5>$1</h5>");
    output = output.replace(/^#### (.*)$/gm, "<h4>$1</h4>");
    output = output.replace(/^### (.*)$/gm, "<h3>$1</h3>");
    output = output.replace(/^## (.*)$/gm, "<h2>$1</h2>");
    output = output.replace(/^# (.*)$/gm, "<h1>$1</h1>");

    output = output.replace(
      /\[([^\]]+)\]\(([^)]+)\)/g,
      '<a href="$2">$1</a>'
    );

    output = output.replace(
      /\*\*(.*?)\*\*/g,
      "<strong>$1</strong>"
    );

    output = output.replace(
      /__(.*?)__/g,
      "<strong>$1</strong>"
    );

    output = output.replace(
      /\*([^*\n]+)\*/g,
      "<em>$1</em>"
    );

    output = output.replace(
      /_([^_\n]+)_/g,
      "<em>$1</em>"
    );

    output = output.replace(
      /`([^`]+)`/g,
      "<code>$1</code>"
    );

    output = output.replace(
      /^> (.*)$/gm,
      "<blockquote>$1</blockquote>"
    );

    output = output.replace(
      /^---$/gm,
      "<hr />"
    );

    output = output.replace(
      /^(?:-|\*) (.*)$/gm,
      "<li>$1</li>"
    );

    output = output.replace(
      /(<li>.*<\/li>)(?:\n|$)/g,
      "$1"
    );

    output = output.replace(
      /((?:<li>.*<\/li>)+)/g,
      "<ul>$1</ul>"
    );

    output = output
      .split(/\n{2,}/)
      .map((block) => {
        const trimmed = block.trim();

        if (!trimmed) return "";

        if (
          trimmed.startsWith("<h") ||
          trimmed.startsWith("<ul") ||
          trimmed.startsWith("<pre") ||
          trimmed.startsWith("<blockquote") ||
          trimmed.startsWith("<hr")
        ) {
          return trimmed;
        }

        return `<p>${trimmed.replace(/\n/g, "<br />")}</p>`;
      })
      .filter(Boolean)
      .join("\n");

    return output;
  };

  const htmlToMarkdown = (html: string) => {
    let output = html.trim();

    output = output.replace(/\r\n/g, "\n");

    output = output.replace(
      /<h1[^>]*>([\s\S]*?)<\/h1>/gi,
      "# $1\n\n"
    );

    output = output.replace(
      /<h2[^>]*>([\s\S]*?)<\/h2>/gi,
      "## $1\n\n"
    );

    output = output.replace(
      /<h3[^>]*>([\s\S]*?)<\/h3>/gi,
      "### $1\n\n"
    );

    output = output.replace(
      /<h4[^>]*>([\s\S]*?)<\/h4>/gi,
      "#### $1\n\n"
    );

    output = output.replace(
      /<h5[^>]*>([\s\S]*?)<\/h5>/gi,
      "##### $1\n\n"
    );

    output = output.replace(
      /<h6[^>]*>([\s\S]*?)<\/h6>/gi,
      "###### $1\n\n"
    );

    output = output.replace(
      /<strong[^>]*>([\s\S]*?)<\/strong>/gi,
      "**$1**"
    );

    output = output.replace(
      /<b[^>]*>([\s\S]*?)<\/b>/gi,
      "**$1**"
    );

    output = output.replace(
      /<em[^>]*>([\s\S]*?)<\/em>/gi,
      "*$1*"
    );

    output = output.replace(
      /<i[^>]*>([\s\S]*?)<\/i>/gi,
      "*$1*"
    );

    output = output.replace(
      /<code[^>]*>([\s\S]*?)<\/code>/gi,
      "`$1`"
    );

    output = output.replace(
      /<a[^>]*href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi,
      "[$2]($1)"
    );

    output = output.replace(
      /<blockquote[^>]*>([\s\S]*?)<\/blockquote>/gi,
      (_, content) => {
        const clean = stripTags(content).trim();

        return clean
          .split("\n")
          .map((line: string) => `> ${line}`)
          .join("\n") + "\n\n";
      }
    );

    output = output.replace(
      /<li[^>]*>([\s\S]*?)<\/li>/gi,
      "- $1\n"
    );

    output = output.replace(
      /<\/?(?:ul|ol)[^>]*>/gi,
      ""
    );

    output = output.replace(
      /<br\s*\/?>/gi,
      "\n"
    );

    output = output.replace(
      /<hr\s*\/?>/gi,
      "\n---\n\n"
    );

    output = output.replace(
      /<p[^>]*>([\s\S]*?)<\/p>/gi,
      "$1\n\n"
    );

    output = output.replace(
      /<pre[^>]*>\s*<code[^>]*>([\s\S]*?)<\/code>\s*<\/pre>/gi,
      (_, content) => {
        return `\`\`\`\n${stripTags(content).trim()}\n\`\`\`\n\n`;
      }
    );

    output = stripTags(output);

    output = decodeHtmlEntities(output);

    output = output
      .replace(/\n{3,}/g, "\n\n")
      .trim();

    return output;
  };

  const handleConvert = () => {
    if (!input.trim()) {
      setResult("");
      return;
    }

    if (mode === "markdown-to-html") {
      setResult(markdownToHtml(input));
    } else {
      setResult(htmlToMarkdown(input));
    }

    setCopied(false);
  };

  const handleCopy = async () => {
    if (!result) return;

    await navigator.clipboard.writeText(result);
    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 1800);
  };

  const handleClear = () => {
    setInput("");
    setResult("");
    setCopied(false);
  };

  const switchMode = (newMode: Mode) => {
    setMode(newMode);
    setInput("");
    setResult("");
    setCopied(false);
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-gradient-to-b from-orange-950 via-orange-950/60 via-[35%] to-[#080706] text-white">

      {/* BACKGROUND GLOW */}

      <div className="pointer-events-none absolute left-1/2 top-[-280px] h-[650px] w-[900px] -translate-x-1/2 rounded-full bg-orange-500/25 blur-[170px]" />

      <div className="pointer-events-none absolute left-[-220px] top-[30%] h-[420px] w-[420px] rounded-full bg-orange-500/10 blur-[150px]" />

      <div className="pointer-events-none absolute right-[-220px] top-[55%] h-[420px] w-[420px] rounded-full bg-amber-500/10 blur-[150px]" />

      <div className="pointer-events-none absolute left-1/2 top-[72%] h-[500px] w-[700px] -translate-x-1/2 rounded-full bg-orange-500/[0.04] blur-[160px]" />

      {/* NAVBAR */}

      <nav className="relative z-30 mx-auto w-full max-w-6xl px-4 pt-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between rounded-2xl border border-white/[0.08] bg-black/35 px-4 py-3 shadow-2xl shadow-black/30 backdrop-blur-2xl sm:px-5">

          <div className="flex items-center gap-3">
            <div className="relative h-10 w-10 overflow-hidden rounded-full border border-orange-400/20 bg-white/10 shadow-lg shadow-orange-500/10">
              <img
                src="/logo.png"
                alt="KrishAIWorks Logo"
                className="h-full w-full object-cover"
              />
            </div>

            <div>
              <h2 className="text-sm font-bold tracking-tight text-white sm:text-base">
                KrishAIWorks
              </h2>

              <p className="text-[9px] font-medium tracking-wide text-zinc-500 sm:text-[10px]">
                AI Solutions That Work
              </p>
            </div>
          </div>

          <div className="hidden items-center gap-1 md:flex">

            <a
              href="#features"
              className="rounded-xl px-4 py-2 text-sm text-zinc-400 transition hover:bg-white/[0.05] hover:text-orange-300"
            >
              Features
            </a>

            <a
              href="#how"
              className="rounded-xl px-4 py-2 text-sm text-zinc-400 transition hover:bg-white/[0.05] hover:text-orange-300"
            >
              How To Use
            </a>

            <a
              href="#faq"
              className="rounded-xl px-4 py-2 text-sm text-zinc-400 transition hover:bg-white/[0.05] hover:text-orange-300"
            >
              FAQ
            </a>

            <a
              href="https://instagram.com/KrishAIWorks"
              target="_blank"
              rel="noopener noreferrer"
              className="ml-2 rounded-xl border border-orange-400/20 bg-orange-500/10 px-5 py-2 text-sm font-semibold text-orange-300 shadow-lg shadow-orange-500/10 transition hover:-translate-y-0.5 hover:bg-orange-500/20 active:scale-95"
            >
              Follow
            </a>
          </div>

          <a
            href="https://instagram.com/KrishAIWorks"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-xl border border-orange-400/20 bg-orange-500/10 px-4 py-2 text-xs font-semibold text-orange-300 transition hover:bg-orange-500/20 md:hidden"
          >
            Follow
          </a>
        </div>
      </nav>

      {/* HERO */}

      <section className="relative z-10 mx-auto flex w-full max-w-6xl flex-col items-center px-5 pb-20 pt-20 text-center sm:px-8 sm:pt-24">

        <div className="rounded-full border border-orange-400/20 bg-orange-500/10 px-4 py-2 text-xs text-orange-200 shadow-lg shadow-orange-950/30 backdrop-blur-xl">
          ✨ Markdown ↔ HTML Converter
        </div>

        <p className="mt-4 text-xs text-zinc-500">
          Built by{" "}
          <span className="font-semibold text-orange-400">
            KrishAIWorks
          </span>
        </p>

        <h1 className="mt-7 max-w-4xl text-4xl font-extrabold leading-[1.08] tracking-tight sm:text-6xl lg:text-7xl">
          Write.
          <br />
          <span className="bg-gradient-to-r from-orange-300 via-amber-400 to-orange-500 bg-clip-text text-transparent">
            Convert. Simplify.
          </span>
        </h1>

        <p className="mt-6 max-w-2xl text-sm leading-7 text-zinc-400 sm:text-base sm:leading-8">
          Convert Markdown to HTML or HTML back to Markdown with a simple,
          fast and developer-friendly tool.
        </p>

        <div className="mt-7 flex flex-wrap justify-center gap-2.5">
          <span className="rounded-full border border-white/5 bg-white/[0.04] px-4 py-2 text-xs text-zinc-300 backdrop-blur-xl">
            ⚡ Instant Conversion
          </span>

          <span className="rounded-full border border-white/5 bg-white/[0.04] px-4 py-2 text-xs text-zinc-300 backdrop-blur-xl">
            💻 Developer Friendly
          </span>

          <span className="rounded-full border border-white/5 bg-white/[0.04] px-4 py-2 text-xs text-zinc-300 backdrop-blur-xl">
            📱 Mobile Friendly
          </span>
        </div>

        {/* CONVERTER */}

        <div
          id="converter"
          className="mt-12 w-full max-w-5xl scroll-mt-8"
        >
          <div className="rounded-[2rem] border border-orange-400/10 bg-black/55 p-5 shadow-2xl shadow-orange-950/30 backdrop-blur-2xl sm:p-7">

            <div className="mb-6 text-left">
              <h2 className="text-lg font-semibold text-white sm:text-xl">
                Markdown ↔ HTML Converter
              </h2>

              <p className="mt-1 text-xs text-zinc-500 sm:text-sm">
                Choose a direction and convert your content instantly.
              </p>
            </div>

            {/* MODE */}

            <div className="mb-6 flex w-full rounded-2xl border border-white/10 bg-white/[0.03] p-1">

              <button
                onClick={() => switchMode("markdown-to-html")}
                className={`flex-1 rounded-xl px-4 py-3 text-xs font-bold transition sm:text-sm ${
                  mode === "markdown-to-html"
                    ? "bg-orange-500 text-black shadow-lg shadow-orange-500/20"
                    : "text-zinc-400 hover:text-white"
                }`}
              >
                Markdown → HTML
              </button>

              <button
                onClick={() => switchMode("html-to-markdown")}
                className={`flex-1 rounded-xl px-4 py-3 text-xs font-bold transition sm:text-sm ${
                  mode === "html-to-markdown"
                    ? "bg-orange-500 text-black shadow-lg shadow-orange-500/20"
                    : "text-zinc-400 hover:text-white"
                }`}
              >
                HTML → Markdown
              </button>

            </div>

            <div className="grid gap-5 lg:grid-cols-2">

              {/* INPUT */}

              <div className="text-left">

                <div className="mb-3 flex items-center justify-between gap-3">
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-orange-400">
                    {mode === "markdown-to-html"
                      ? "Markdown Input"
                      : "HTML Input"}
                  </p>

                  <span className="text-xs text-zinc-600">
                    {input.length} chars
                  </span>
                </div>

                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={
                    mode === "markdown-to-html"
                      ? `# Hello World

Write your Markdown here...

**Bold text**
*Italic text*

- List item
- Another item`
                      : `<h1>Hello World</h1>

<p>Write your HTML here...</p>

<strong>Bold text</strong>

<ul>
  <li>List item</li>
</ul>`
                  }
                  className="h-[320px] w-full resize-y overflow-y-auto rounded-2xl border border-orange-400/20 bg-black/40 p-5 font-mono text-sm leading-7 text-white placeholder:text-zinc-700 outline-none transition focus:border-orange-400 focus:ring-2 focus:ring-orange-400/20"
                />
              </div>

              {/* RESULT */}

              <div className="text-left">

                <div className="mb-3 flex items-center justify-between gap-3">
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-orange-400">
                    {mode === "markdown-to-html"
                      ? "HTML Result"
                      : "Markdown Result"}
                  </p>

                  {result && (
                    <button
                      onClick={handleCopy}
                      className="shrink-0 rounded-xl bg-orange-500 px-4 py-2 text-xs font-semibold text-black shadow-lg shadow-orange-500/20 transition hover:bg-orange-400 active:scale-95"
                    >
                      {copied ? "✓ Copied" : "📋 Copy"}
                    </button>
                  )}
                </div>

                {/* FIXED RESULT BOX */}

                <div className="h-[320px] overflow-y-auto rounded-2xl border border-orange-400/10 bg-[#050505] p-5">

                  {result ? (
                    <pre className="whitespace-pre-wrap break-words font-mono text-xs leading-7 text-orange-100 sm:text-sm">
                      {result}
                    </pre>
                  ) : (
                    <p className="text-sm leading-7 text-zinc-700">
                      Your converted result will appear here...
                    </p>
                  )}

                </div>
              </div>
            </div>

            {/* ACTIONS */}

            <div className="mt-5 flex flex-col gap-3 sm:flex-row">

              <button
                onClick={handleConvert}
                className="h-14 flex-1 rounded-2xl bg-orange-500 px-7 text-sm font-bold text-black shadow-xl shadow-orange-500/20 transition duration-300 hover:-translate-y-0.5 hover:bg-orange-400 active:scale-[0.98]"
              >
                ✨ Convert
              </button>

              <button
                onClick={handleClear}
                className="h-14 rounded-2xl border border-white/10 bg-white/[0.04] px-8 text-sm font-semibold text-zinc-300 transition hover:bg-white/[0.08] hover:text-white active:scale-[0.98]"
              >
                Clear
              </button>

            </div>

            <p className="mt-3 text-left text-xs text-zinc-600">
              Conversion happens directly in your browser.
            </p>

          </div>
        </div>
      </section>

      {/* FEATURES */}

      <section
        id="features"
        className="relative z-10 mx-auto w-full max-w-6xl scroll-mt-10 px-5 py-24 sm:px-8"
      >

        <div className="mx-auto max-w-2xl text-center">

          <div className="mx-auto inline-flex rounded-full border border-orange-400/10 bg-orange-500/5 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-orange-400">
            Why Use It
          </div>

          <h2 className="mt-5 text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Convert in{" "}
            <span className="text-orange-400">
              either direction.
            </span>
          </h2>

          <p className="mt-4 text-sm leading-7 text-zinc-500">
            A lightweight converter for everyday Markdown and HTML workflows.
          </p>

        </div>

        <div className="mt-12 grid gap-5 md:grid-cols-3">

          <FeatureCard
            icon="⚡"
            number="01"
            title="Instant Conversion"
            description="Convert your content immediately without unnecessary processing."
          />

          <FeatureCard
            icon="↔️"
            number="02"
            title="Two-Way Conversion"
            description="Switch between Markdown to HTML and HTML to Markdown whenever you need."
          />

          <FeatureCard
            icon="📱"
            number="03"
            title="Mobile Friendly"
            description="Use the converter comfortably across phones, tablets and desktops."
          />

        </div>
      </section>

      {/* HOW TO USE */}

      <section
        id="how"
        className="relative z-10 mx-auto w-full max-w-6xl scroll-mt-10 px-5 py-24 sm:px-8"
      >

        <div className="mx-auto max-w-2xl text-center">

          <div className="mx-auto inline-flex rounded-full border border-orange-400/10 bg-orange-500/5 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-orange-400">
            How To Use
          </div>

          <h2 className="mt-5 text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Three simple steps.
          </h2>

          <p className="mt-4 text-sm leading-7 text-zinc-500">
            Convert your content in seconds.
          </p>

        </div>

        <div className="mt-12 grid gap-5 md:grid-cols-3">

          <StepCard
            number="01"
            title="Choose Direction"
            description="Select Markdown to HTML or HTML to Markdown."
          />

          <StepCard
            number="02"
            title="Enter Content"
            description="Paste or write your content in the input editor."
          />

          <StepCard
            number="03"
            title="Copy Result"
            description="Convert instantly and copy the generated result."
          />

        </div>
      </section>

      {/* FAQ */}

      <section
        id="faq"
        className="relative z-10 mx-auto w-full max-w-3xl scroll-mt-10 px-5 py-24 sm:px-8"
      >

        <div className="text-center">

          <div className="mx-auto inline-flex rounded-full border border-orange-400/10 bg-orange-500/5 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-orange-400">
            FAQ
          </div>

          <h2 className="mt-5 text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Frequently Asked Questions
          </h2>

        </div>

        <div className="mt-10 space-y-4">

          <Faq
            question="Can I convert both ways?"
            answer="Yes. You can convert Markdown to HTML or HTML back to Markdown."
          />

          <Faq
            question="Is my content uploaded?"
            answer="No. Conversion happens directly inside your browser."
          />

          <Faq
            question="What Markdown elements are supported?"
            answer="The converter supports common headings, paragraphs, bold, italic, links, lists, blockquotes, inline code and code blocks."
          />

        </div>
      </section>

      {/* CTA */}

      <section className="relative z-10 mx-auto w-full max-w-5xl px-5 py-20 sm:px-8">

        <div className="relative overflow-hidden rounded-[2rem] border border-orange-400/10 bg-gradient-to-br from-orange-950/70 via-[#090807]/90 to-black px-6 py-14 text-center shadow-2xl shadow-orange-950/30 backdrop-blur-xl sm:px-12">

          <div className="pointer-events-none absolute left-1/2 top-[-180px] h-[350px] w-[500px] -translate-x-1/2 rounded-full bg-orange-500/10 blur-[120px]" />

          <div className="relative">

            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-orange-400/20 bg-orange-500/10 text-2xl shadow-lg shadow-orange-500/10">
              ↔️
            </div>

            <p className="mt-6 text-xs font-semibold uppercase tracking-[0.25em] text-orange-400">
              KrishAIWorks
            </p>

            <h2 className="mt-4 text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Markdown ↔ HTML. Done.
            </h2>

            <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-zinc-500">
              Convert your content in either direction without unnecessary
              complexity.
            </p>

            <button
              onClick={() =>
                document
                  .getElementById("converter")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
              className="mt-8 inline-flex rounded-xl bg-orange-500 px-7 py-3 text-sm font-semibold text-black shadow-xl shadow-orange-500/20 transition hover:-translate-y-0.5 hover:bg-orange-400 active:scale-95"
            >
              ✨ Try It Now
            </button>

          </div>
        </div>
      </section>

      {/* FOOTER */}

      <footer className="relative z-10 border-t border-white/5 px-5 py-10">

        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-7 sm:flex-row">

          <div className="flex items-center gap-3">

            <img
              src="/logo.png"
              alt="KrishAIWorks Logo"
              className="h-12 w-12 rounded-full border border-orange-400/20 object-cover shadow-lg shadow-orange-500/10"
            />

            <div>
              <p className="font-semibold text-white">
                KrishAIWorks
              </p>

              <p className="mt-1 text-xs text-zinc-600">
                AI Solutions That Work
              </p>
            </div>

          </div>

          <a
            href="https://instagram.com/KrishAIWorks"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-zinc-500 transition hover:text-orange-400"
          >
            Instagram · @KrishAIWorks
          </a>

          <div className="text-center sm:text-right">
            <p className="text-xs text-zinc-600">
              © 2026 KrishAIWorks
            </p>

            <p className="mt-1 text-xs text-zinc-700">
              Built with AI.
            </p>
          </div>

        </div>
      </footer>
    </main>
  );
}

/* ============================================================= */
/* HELPERS */
/* ============================================================= */

function stripTags(value: string) {
  return value.replace(/<[^>]*>/g, "");
}

function decodeHtmlEntities(value: string) {
  if (typeof window === "undefined") return value;

  const textarea = document.createElement("textarea");
  textarea.innerHTML = value;
  return textarea.value;
}

/* ============================================================= */
/* FEATURE CARD */
/* ============================================================= */

function FeatureCard({
  icon,
  number,
  title,
  description,
}: {
  icon: string;
  number: string;
  title: string;
  description: string;
}) {
  return (
    <div className="group relative overflow-hidden rounded-3xl border border-white/10 bg-black/45 p-7 shadow-xl backdrop-blur-xl transition hover:border-orange-400/20">

      <div className="text-3xl">
        {icon}
      </div>

      <p className="mt-5 text-xs font-black tracking-[0.2em] text-orange-400">
        {number}
      </p>

      <h3 className="mt-3 text-lg font-bold text-orange-300">
        {title}
      </h3>

      <p className="mt-3 text-sm leading-7 text-zinc-500">
        {description}
      </p>

    </div>
  );
}

/* ============================================================= */
/* STEP CARD */
/* ============================================================= */

function StepCard({
  number,
  title,
  description,
}: {
  number: string;
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-3xl border border-white/10 bg-black/45 p-7 backdrop-blur-xl">

      <p className="text-xs font-black tracking-[0.25em] text-orange-400">
        {number}
      </p>

      <h3 className="mt-4 text-lg font-bold text-white">
        {title}
      </h3>

      <p className="mt-3 text-sm leading-7 text-zinc-500">
        {description}
      </p>

    </div>
  );
}

/* ============================================================= */
/* FAQ */
/* ============================================================= */

function Faq({
  question,
  answer,
}: {
  question: string;
  answer: string;
}) {
  return (
    <details className="group rounded-2xl border border-white/10 bg-black/45 p-5 backdrop-blur-xl">

      <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold text-white">

        <span>{question}</span>

        <span className="text-xl text-orange-400 transition group-open:rotate-45">
          +
        </span>

      </summary>

      <p className="mt-4 text-sm leading-7 text-zinc-500">
        {answer}
      </p>

    </details>
  );
}
interface WindowOrWorkerGlobalScope {
    readonly ai: AI;
}

interface AI {
    readonly languageModel: AILanguageModelFactory;
    readonly summarizer: AISummarizerFactory;
    readonly writer: AIWriterFactory;
    readonly rewriter: AIRewriterFactory;
    readonly translator: AITranslatorFactory;
    readonly languageDetector: AILanguageDetectorFactory;
}

interface AICreateMonitor extends EventTarget {
    ondownloadprogress: ((this: AICreateMonitor, ev: DownloadProgressEvent) => any) | null;

    addEventListener<K extends keyof AICreateMonitorEventMap>(
        type: K,
        listener: (this: AICreateMonitor, ev: AICreateMonitorEventMap[K]) => any,
        options?: boolean | AddEventListenerOptions,
    ): void;
    addEventListener(
        type: string,
        listener: EventListenerOrEventListenerObject,
        options?: boolean | AddEventListenerOptions,
    ): void;
    removeEventListener<K extends keyof AICreateMonitorEventMap>(
        type: K,
        listener: (this: AICreateMonitor, ev: AICreateMonitorEventMap[K]) => any,
        options?: boolean | EventListenerOptions,
    ): void;
    removeEventListener(
        type: string,
        listener: EventListenerOrEventListenerObject,
        options?: boolean | EventListenerOptions,
    ): void;
}

interface DownloadProgressEvent extends Event {
    readonly loaded: number;
    readonly total: number;
}

interface AICreateMonitorEventMap {
    downloadprogress: DownloadProgressEvent;
}

type AICreateMonitorCallback = (monitor: AICreateMonitor) => void;

type AICapabilityAvailability = "readily" | "after-download" | "no";

// Language Model
// https://github.com/explainers-by-googlers/prompt-api/#full-api-surface-in-web-idl

interface AILanguageModelFactory {
    create(
        options?: AILanguageModelCreateOptionsWithSystemPrompt | AILanguageModelCreateOptionsWithoutSystemPrompt,
    ): Promise<AILanguageModel>;
    capabilities(): Promise<AILanguageModelCapabilities>;
}

interface AILanguageModelCreateOptions {
    signal?: AbortSignal;
    monitor?: AICreateMonitorCallback;

    topK?: number;
    temperature?: number;
}

interface AILanguageModelCreateOptionsWithSystemPrompt extends AILanguageModelCreateOptions {
    systemPrompt?: string;
    initialPrompts?: AILanguageModelPrompt[];
}

interface AILanguageModelCreateOptionsWithoutSystemPrompt extends AILanguageModelCreateOptions {
    systemPrompt?: never;
    initialPrompts?:
        | [AILanguageModelSystemPrompt, ...AILanguageModelPrompt[]]
        | AILanguageModelPrompt[];
}

type AILanguageModelPromptRole = "user" | "assistant";
type AILanguageModelInitialPromptRole = "system" | AILanguageModelPromptRole;

interface AILanguageModelPrompt {
    role: AILanguageModelPromptRole;
    content: string;
}

interface AILanguageModelInitialPrompt {
    role: AILanguageModelInitialPromptRole;
    content: string;
}

interface AILanguageModelSystemPrompt extends AILanguageModelInitialPrompt {
    role: "system";
}

type AILanguageModelPromptInput = string | AILanguageModelPrompt | AILanguageModelPrompt[];

interface AILanguageModel extends EventTarget {
    prompt(input: AILanguageModelPromptInput, options?: AILanguageModelPromptOptions): Promise<string>;
    promptStreaming(input: AILanguageModelPromptInput, options?: AILanguageModelPromptOptions): ReadableStream<string>;

    countPromptTokens(input: AILanguageModelPromptInput, options?: AILanguageModelPromptOptions): Promise<number>;
    readonly maxTokens: number;
    readonly tokensSoFar: number;
    readonly tokensLeft: number;

    readonly topK: number;
    readonly temperature: number;

    oncontextoverflow: ((this: AILanguageModel, ev: Event) => any) | null;

    addEventListener<K extends keyof AILanguageModelEventMap>(
        type: K,
        listener: (this: AILanguageModel, ev: AILanguageModelEventMap[K]) => any,
        options?: boolean | AddEventListenerOptions,
    ): void;
    addEventListener(
        type: string,
        listener: EventListenerOrEventListenerObject,
        options?: boolean | AddEventListenerOptions,
    ): void;
    removeEventListener<K extends keyof AILanguageModelEventMap>(
        type: K,
        listener: (this: AILanguageModel, ev: AILanguageModelEventMap[K]) => any,
        options?: boolean | EventListenerOptions,
    ): void;
    removeEventListener(
        type: string,
        listener: EventListenerOrEventListenerObject,
        options?: boolean | EventListenerOptions,
    ): void;

    clone(options?: AILanguageModelCloneOptions): Promise<AILanguageModel>;
    destroy(): void;
}

interface AILanguageModelEventMap {
    contextoverflow: Event;
}

interface AILanguageModelPromptOptions {
    signal?: AbortSignal;
}

interface AILanguageModelCloneOptions {
    signal?: AbortSignal;
}

interface AILanguageModelCapabilities {
    readonly available: AICapabilityAvailability;
    languageAvailable(languageTag: Intl.UnicodeBCP47LocaleIdentifier): AICapabilityAvailability;

    readonly defaultTopK: number | null;
    readonly maxTopK: number | null;
    readonly defaultTemperature: number | null;
    readonly maxTemperature: number | null;
}

// Summarizer
// https://github.com/explainers-by-googlers/writing-assistance-apis/#full-api-surface-in-web-idl

interface AISummarizerFactory {
    create(options?: AISummarizerCreateOptions): Promise<AISummarizer>;
    capabilities(): Promise<AISummarizerCapabilities>;
}

interface AISummarizerCreateOptions {
    signal?: AbortSignal;
    monitor?: AICreateMonitorCallback;

    sharedContext?: string;
    type?: AISummarizerType;
    format?: AISummarizerFormat;
    length?: AISummarizerLength;
}

type AISummarizerType = "tl;dr" | "key-points" | "teaser" | "headline";
type AISummarizerFormat = "plain-text" | "markdown";
type AISummarizerLength = "short" | "medium" | "long";

interface AISummarizer {
    summarize(input: string, options?: AISummarizerSummarizeOptions): Promise<string>;
    summarizeStreaming(input: string, options?: AISummarizerSummarizeOptions): ReadableStream<string>;

    readonly sharedContext: string;
    readonly type: AISummarizerType;
    readonly format: AISummarizerFormat;
    readonly length: AISummarizerLength;

    destroy(): void;
}

interface AISummarizerSummarizeOptions {
    signal?: AbortSignal;
    context?: string;
}

interface AISummarizerCapabilities {
    readonly available: AICapabilityAvailability;

    supportsType(type: AISummarizerType): AICapabilityAvailability;
    supportsFormat(format: AISummarizerFormat): AICapabilityAvailability;
    supportsLength(length: AISummarizerLength): AICapabilityAvailability;

    languageAvailable(languageTag: Intl.UnicodeBCP47LocaleIdentifier): AICapabilityAvailability;
}

// Writer
// https://github.com/explainers-by-googlers/writing-assistance-apis/#full-api-surface-in-web-idl

interface AIWriterFactory {
    create(options?: AIWriterCreateOptions): Promise<AIWriter>;
    capabilities(): Promise<AIWriterCapabilities>;
}

interface AIWriterCreateOptions {
    signal?: AbortSignal;
    monitor?: AICreateMonitorCallback;

    sharedContext?: string;
    tone?: AIWriterTone;
    format?: AIWriterFormat;
    length?: AIWriterLength;
}

type AIWriterTone = "formal" | "neutral" | "casual";
type AIWriterFormat = "plain-text" | "markdown";
type AIWriterLength = "short" | "medium" | "long";

interface AIWriter {
    write(writingTask: string, options?: AIWriterWriteOptions): Promise<string>;
    writeStreaming(writingTask: string, options?: AIWriterWriteOptions): ReadableStream<string>;

    readonly sharedContext: string;
    readonly tone: AIWriterTone;
    readonly format: AIWriterFormat;
    readonly length: AIWriterLength;

    destroy(): void;
}

interface AIWriterWriteOptions {
    signal?: AbortSignal;
    context?: string;
}

interface AIWriterCapabilities {
    readonly available: AICapabilityAvailability;

    supportsTone(tone: AIWriterTone): AICapabilityAvailability;
    supportsFormat(format: AIWriterFormat): AICapabilityAvailability;
    supportsLength(length: AIWriterLength): AICapabilityAvailability;

    languageAvailable(languageTag: Intl.UnicodeBCP47LocaleIdentifier): AICapabilityAvailability;
}

// Rewriter
// https://github.com/explainers-by-googlers/writing-assistance-apis/#full-api-surface-in-web-idl

interface AIRewriterFactory {
    create(options?: AIRewriterCreateOptions): Promise<AIRewriter>;
    capabilities(): Promise<AIRewriterCapabilities>;
}

interface AIRewriterCreateOptions {
    signal?: AbortSignal;
    monitor?: AICreateMonitorCallback;

    sharedContext?: string;
    tone?: AIRewriterTone;
    format?: AIRewriterFormat;
    length?: AIRewriterLength;
}

type AIRewriterTone = "as-is" | "more-formal" | "more-casual";
type AIRewriterFormat = "as-is" | "plain-text" | "markdown";
type AIRewriterLength = "as-is" | "shorter" | "longer";

interface AIRewriter {
    rewrite(input: string, options?: AIRewriterRewriteOptions): Promise<string>;
    rewriteStreaming(input: string, options?: AIRewriterRewriteOptions): ReadableStream<string>;

    readonly sharedContext: string;
    readonly tone: AIRewriterTone;
    readonly format: AIRewriterFormat;
    readonly length: AIRewriterLength;

    destroy(): void;
}

interface AIRewriterRewriteOptions {
    signal?: AbortSignal;
    context?: string;
}

interface AIRewriterCapabilities {
    readonly available: AICapabilityAvailability;

    supportsTone(tone: AIRewriterTone): AICapabilityAvailability;
    supportsFormat(format: AIRewriterFormat): AICapabilityAvailability;
    supportsLength(length: AIRewriterLength): AICapabilityAvailability;

    languageAvailable(languageTag: Intl.UnicodeBCP47LocaleIdentifier): AICapabilityAvailability;
}

// Translator
// https://github.com/WICG/translation-api?tab=readme-ov-file#full-api-surface-in-web-idl

interface AITranslatorFactory {
    create(options: AITranslatorCreateOptions): Promise<AITranslator>;
    capabilities(): Promise<AITranslatorCapabilities>;
}

interface AITranslator {
    translate(input: string, options?: AITranslatorTranslateOptions): Promise<string>;
    translateStreaming(input: string, options?: AITranslatorTranslateOptions): ReadableStream;

    readonly sourceLanguage: Intl.UnicodeBCP47LocaleIdentifier;
    readonly targetLanguage: Intl.UnicodeBCP47LocaleIdentifier;

    destroy(): void;
}

interface AITranslatorCapabilities {
    readonly available: AICapabilityAvailability;

    languagePairAvailable(
        sourceLanguage: Intl.UnicodeBCP47LocaleIdentifier,
        targetLanguage: Intl.UnicodeBCP47LocaleIdentifier,
    ): AICapabilityAvailability;
}

interface AITranslatorCreateOptions {
    signal?: AbortSignal;
    monitor?: AICreateMonitorCallback;

    sourceLanguage: Intl.UnicodeBCP47LocaleIdentifier;
    targetLanguage: Intl.UnicodeBCP47LocaleIdentifier;
}

interface AITranslatorTranslateOptions {
    signal?: AbortSignal;
}

// Language detector
// https://github.com/WICG/translation-api?tab=readme-ov-file#full-api-surface-in-web-idl

interface AILanguageDetectorFactory {
    create(options?: AILanguageDetectorCreateOptions): Promise<AILanguageDetector>;
    capabilities(): Promise<AILanguageDetectorCapabilities>;
}

interface AILanguageDetector {
    detect(input: string, options?: AILanguageDetectorDetectOptions): Promise<LanguageDetectionResult[]>;

    destroy(): void;
}

interface AILanguageDetectorCapabilities {
    readonly available: AICapabilityAvailability;

    languageAvailable(languageTag: Intl.UnicodeBCP47LocaleIdentifier): AICapabilityAvailability;
}

interface AILanguageDetectorCreateOptions {
    signal?: AbortSignal;
    monitor?: AICreateMonitorCallback;
}

interface AILanguageDetectorDetectOptions {
    signal?: AbortSignal;
}

interface LanguageDetectionResult {
    /** null represents unknown language */
    detectedLanguage: Intl.UnicodeBCP47LocaleIdentifier | null;
    confidence: number;
}

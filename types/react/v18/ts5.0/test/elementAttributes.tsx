import * as React from "react";

declare module "react" {
    namespace JSX {
        interface IntrinsicElements {
            "custom-element": React.HTMLAttributes<unknown>;
        }
    }
}

const testCases = [
    <span />,
    <span accessKey="s" />,
    <span autoFocus />,
    <span className="klass" />,
    <span contentEditable />,
    <span
        contentEditable
        // @ts-expect-error -- Use data-placeholder instead.
        placeholder="foo"
    />,
    <span contentEditable="plaintext-only" />,
    <span contextMenu="menuId" />,
    <span dir="rtl" />,
    <span draggable />,
    <span enterKeyHint="done" />,
    <span hidden />,
    <span id="s" />,
    <span lang="art-x-tokipona" />,
    <input placeholder="placeholder" />,
    <span slot="my-text" />,
    <span spellCheck />,
    <span tabIndex={0} />,
    <span title="title" />,
    <span role="button" />,
    <span autoCapitalize="off" />,
    <span autoCapitalize="none" />,
    <span autoCapitalize="on" />,
    <span autoCapitalize="words" />,
    <span autoCapitalize="sentences" />,
    <span autoCapitalize="characters" />,
    <span autoCorrect="off" />,
    <span autoCorrect="on" />,
    <span translate="no" />,
    <span translate="yes" />,
    <svg>
        <image crossOrigin="anonymous" />
    </svg>,
    <details open={true} onToggle={() => {}} name="foo" />,
    <input value={["one", "two"] as readonly string[]} />,
    <input value={["one", "two"] as string[]} />,
    <input value={["one", "two"]} />,
    <input enterKeyHint="done" />,
    <input accept="image/*" capture="user" />,
    <input accept="image/*" capture="environment" />,
    <input accept="image/*" capture />,
    <input accept="video/*" capture="user" />,
    <input accept="video/*" capture="environment" />,
    // @ts-expect-error
    <input accept="video/*" capture="haha" />,
    <input accept="video/*" capture />,
    <input accept="audio/*" capture />,

    <div role="dialog" />,
    <div role="none presentation" />,
    <svg role="treeitem" />,
    <a target="_blank"></a>,
    <a target="some-frame"></a>,
    <input type="button" />,
    <input type="some-type" />,
    // @ts-expect-error
    <input enterKeyHint="don" />,
    <video disableRemotePlayback onResize={() => {}} />,
    <picture>
        <source media="test" srcSet="test" width={50} height={50} />
        <img src="test" width={100} height={100} />
    </picture>,
    <picture>
        <source media="test" srcSet="test" width={50} height={50} />
        <img alt="test" src="test" width={100} height={100} fetchPriority="high" />
    </picture>,
    <picture>
        <source media="test" srcSet="test" width={50} height={50} />
        <img alt="test" src="test" width={100} height={100} fetchPriority="low" />
    </picture>,
    <picture>
        <source media="test" srcSet="test" width={50} height={50} />
        <img alt="test" src="test" width={100} height={100} fetchPriority="auto" />
    </picture>,
    <dialog
        onCancel={event => {
            // $ExpectType SyntheticEvent<HTMLDialogElement, Event>
            event;
        }}
        onClose={event => {
            // $ExpectType SyntheticEvent<HTMLDialogElement, Event>
            event;
        }}
    >
    </dialog>,
    <link nonce="8IBTHwOdqNKAWeKl7plt8g==" />,
    <center></center>,
    <>
        <template>
            <div part="base" />
            <custom-element exportparts="nested" />
        </template>
    </>,
    <link rel="expect" href="#lead-content" blocking="render" />,
    <link rel="expect" href="#lead-content" blocking="render render" />,
    <style blocking="render" />,
    <style blocking="render render" />,
    <script blocking="render" async />,
    <script blocking="render render" async />,
];

// Needed to check these HTML elements in event callbacks.
// "Imported" from typescript's lib.dom.d.ts.
declare global {
    interface HTMLDetailsElement {
        open: boolean;
    }

    interface HTMLMeterElement {
        optimum: number;
    }

    interface HTMLModElement {
        cite: string;
    }

    interface HTMLOutputElement {
        value: string;
    }

    interface HTMLQuoteElement {
        cite: string;
    }

    interface HTMLTimeElement {
        dateTime: string;
    }
}

const eventCallbacksTestCases = [
    <blockquote onClick={e => e.currentTarget.cite} />,
    <del onClick={e => e.currentTarget.cite} />,
    <details onClick={e => e.currentTarget.open} />,
    <meter onClick={e => e.currentTarget.optimum} />,
    <output onClick={e => e.currentTarget.value} />,
    <time onClick={e => e.currentTarget.dateTime} />,
];

function formActionsTest() {
    <form
        // @ts-expect-error Form Actions are not supported in React 18.
        action={formData => {
            // $ExpectType any
            formData;
        }}
    >
        <input type="text" name="title" defaultValue="Hello" />
        <input
            type="submit"
            // @ts-expect-error Form Actions are not supported in React 18.
            formAction={formData => {
                // $ExpectType any
                formData;
            }}
            value="Save"
        />
        <button
            // @ts-expect-error Form Actions are not supported in React 18.
            formAction={formData => {
                // $ExpectType any
                formData;
            }}
        >
            Delete
        </button>
    </form>;
}

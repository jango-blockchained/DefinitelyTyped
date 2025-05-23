import { JSX } from "react";
import React = require("react");

interface SCProps {
    foo?: number | undefined;
}
const FunctionComponent: React.FunctionComponent<SCProps> = ({ foo }: SCProps) => {
    return <div>{foo}</div>;
};
FunctionComponent.displayName = "FunctionComponent3";
<FunctionComponent />;
<slot name="slot1"></slot>;
// `FunctionComponent` has no `children`
// @ts-expect-error
<FunctionComponent>24</FunctionComponent>;

const ComponentWithChildren1: React.FunctionComponent<React.PropsWithChildren> = ({ children }) => {
    return <div>{children}</div>;
};
<ComponentWithChildren1></ComponentWithChildren1>;
// @ts-expect-error
<ComponentWithChildren1 foo={42}></ComponentWithChildren1>;
// @ts-expect-error
<ComponentWithChildren1 foo="42"></ComponentWithChildren1>;
// @ts-expect-error
<ComponentWithChildren1 bar={42}></ComponentWithChildren1>;
// @ts-expect-error
<ComponentWithChildren1 bar="42"></ComponentWithChildren1>;

interface ComponentWithChildren2Props {
    foo?: number | undefined;
}
const ComponentWithChildren2: React.FunctionComponent<React.PropsWithChildren<ComponentWithChildren2Props>> = (
    { children },
) => {
    return <div>{children}</div>;
};
<ComponentWithChildren2></ComponentWithChildren2>;
<ComponentWithChildren2 foo={42}></ComponentWithChildren2>;
// @ts-expect-error
<ComponentWithChildren2 foo="42"></ComponentWithChildren2>;
// @ts-expect-error
<ComponentWithChildren2 bar={42}></ComponentWithChildren2>;
// @ts-expect-error
<ComponentWithChildren2 bar="42"></ComponentWithChildren2>;

interface ComponentWithChildren3Props {
    foo?: number | undefined;
    bar: number;
}
const ComponentWithChildren3: React.FunctionComponent<React.PropsWithChildren<ComponentWithChildren3Props>> = (
    { children },
) => {
    return <div>{children}</div>;
};
// @ts-expect-error
<ComponentWithChildren3></ComponentWithChildren3>;
// @ts-expect-error
<ComponentWithChildren3 foo={42}></ComponentWithChildren3>;
// @ts-expect-error
<ComponentWithChildren3 foo="42"></ComponentWithChildren3>;
<ComponentWithChildren3 bar={42}></ComponentWithChildren3>;
// @ts-expect-error
<ComponentWithChildren3 bar="42"></ComponentWithChildren3>;

// svg sanity check
<svg suppressHydrationWarning viewBox="0 0 1000 1000">
    <g>
        <text x="200" y="300" strokeWidth="5" stroke="black" alignmentBaseline="middle">
            Hello, world!
            <animateMotion
                path="M20,50 C20,-50 180,150 180,50 C180-50 20,150 20,50 z"
                dur="5s"
                repeatCount="indefinite"
            />
        </text>
        <div slot="Some Div">Hello again!</div>
    </g>
</svg>;

// React-specific Attributes
<div
    defaultChecked
    defaultValue="some value"
    contentEditable
    enterKeyHint="done"
    suppressContentEditableWarning
    suppressHydrationWarning
>
    <b>foo</b>
</div>;

// WAI-ARIA 1.1 Attributes
<div
    aria-atomic={false}
    aria-checked="true"
    aria-colcount={7}
    aria-label="test"
>
    <b>bar</b>
</div>;

// button type attribute
<button type="submit">foo</button>;
<button type="reset">foo</button>;
<button type="button">foo</button>;
// @ts-expect-error
<button type="botton">foo</button>;
// @ts-expect-error
<button type={"botton" as string}>foo</button>;

interface Props {
    hello: string;
}
interface State {
    foobar: string;
}
class ComponentWithPropsAndState extends React.Component<Props, State> {
}
<ComponentWithPropsAndState hello="TypeScript" />;

class ComponentWithoutState extends React.Component<Props> {
}
<ComponentWithoutState hello="TypeScript" />;

class ComponentWithoutPropsAndState extends React.Component {
}
<ComponentWithoutPropsAndState />;

const FunctionComponentWithoutProps: React.FunctionComponent = props => {
    return <div />;
};
<FunctionComponentWithoutProps />;

// React.createContext
const Context = React.createContext("defaultValue");

// @ts-expect-error Forgot value
<Context.Provider />;
<Context.Provider value="provided" />;
<Context.Provider value="provided">
    <div />
</Context.Provider>;
// @ts-expect-error Wrong value type
<Context.Provider value={5} />;
// @ts-expect-error Requires explicit default value.
React.createContext();
const UndefinedContext = React.createContext(undefined);
// @ts-expect-error Forgot value even if it can be undefined
<UndefinedContext.Provider />;
<UndefinedContext.Provider value={undefined} />;

<Context.Provider value="provided value">
</Context.Provider>;
<Context value="provided value">
</Context>;

// unstable APIs should not be part of the typings
// @ts-expect-error
const ContextUsingUnstableObservedBits = React.createContext(undefined, (previous, next) => 7);
// @ts-expect-error
<Context.Consumer unstable_observedBits={4}>
    {(value: unknown) => null}
</Context.Consumer>;

// Fragments
<div>
    <React.Fragment>
        <React.Fragment key="foo">
            <span>Child 1</span>
            <span>Child 2</span>
        </React.Fragment>
        <React.Fragment key="bar">
            <span>Child 3</span>
            <span>Child 4</span>
        </React.Fragment>
    </React.Fragment>
</div>;

// Strict Mode
<div>
    <React.StrictMode>
        <div />
    </React.StrictMode>
</div>;

// Below tests that setState() works properly for both regular and callback modes
class SetStateTest extends React.Component<{}, { foo: boolean; bar: boolean }> {
    handleSomething = () => {
        // @ts-expect-error
        this.setState({ foo: "" });
        this.setState({ foo: true });
        this.setState({ foo: true, bar: true });
        this.setState({});
        this.setState(null);
        // @ts-expect-error
        this.setState({ foo: true, foo2: true });
        // @ts-expect-error
        this.setState(() => ({ foo: "" }));
        this.setState(() => ({ foo: true }));
        this.setState(() => ({ foo: true, bar: true }));
        // @ts-expect-error
        this.setState(() => ({ foo: true, foo2: true }));
        // @ts-expect-error
        this.setState(() => ({ foo: "", foo2: true }));
        this.setState(() => ({})); // ok!
        // @ts-expect-error
        this.setState({ foo: true, bar: undefined });
        this.setState(prevState => (prevState.bar ? { bar: false } : null));
    };
}

// Below tests that extended types for state work
export abstract class SetStateTestForExtendsState<P, S extends { baseProp: string }> extends React.Component<P, S> {
    foo() {
        this.setState({ baseProp: "foobar" });
    }
}

// Below tests that & generic still works
// This is invalid because 'S' may specify a different type for `baseProp`.
// export abstract class SetStateTestForAndedState<P, S> extends React.Component<P, S & { baseProp: string }> {
//        foo() {
//            this.setState({ baseProp: 'foobar' });
//        }
// }

interface NewProps {
    foo: string;
}
interface NewState {
    bar: string;
}

class ComponentWithNewLifecycles extends React.Component<NewProps, NewState, { baz: string }> {
    static getDerivedStateFromProps: React.GetDerivedStateFromProps<NewProps, NewState> = nextProps => {
        return { bar: `${nextProps.foo}bar` };
    };

    state = {
        bar: "foo",
    };

    getSnapshotBeforeUpdate(prevProps: Readonly<NewProps>) {
        return { baz: `${prevProps.foo}baz` };
    }

    componentDidUpdate(prevProps: Readonly<NewProps>, prevState: Readonly<NewState>, snapshot: { baz: string }) {
        return;
    }

    render() {
        return this.state.bar;
    }
}
<ComponentWithNewLifecycles foo="bar" />;

class PureComponentWithNewLifecycles extends React.PureComponent<NewProps, NewState, { baz: string }> {
    static getDerivedStateFromProps: React.GetDerivedStateFromProps<NewProps, NewState> = nextProps => {
        return { bar: `${nextProps.foo}bar` };
    };

    state = {
        bar: "foo",
    };

    getSnapshotBeforeUpdate(prevProps: Readonly<NewProps>) {
        return { baz: `${prevProps.foo}baz` };
    }

    componentDidUpdate(prevProps: Readonly<NewProps>, prevState: Readonly<NewState>, snapshot: { baz: string }) {
        return;
    }

    render() {
        return this.state.bar;
    }
}
<PureComponentWithNewLifecycles foo="bar" />;

class ComponentWithLargeState extends React.Component<{}, Record<"a" | "b" | "c", string>> {
    static getDerivedStateFromProps: React.GetDerivedStateFromProps<{}, Record<"a" | "b" | "c", string>> = () => {
        return { a: "a" };
    };
}
const AssignedComponentWithLargeState: React.ComponentClass = ComponentWithLargeState;

const componentWithBadLifecycle = new (class extends React.Component<{}, {}, number> {})({});
// @ts-expect-error
componentWithBadLifecycle.getSnapshotBeforeUpdate = () => {
    return "number";
};
// @ts-expect-error
componentWithBadLifecycle.componentDidUpdate = (prevProps: {}, prevState: {}, snapshot?: string) => {
    return;
};

const Memoized1 = React.memo(function Foo(props: { foo: string }) {
    return null;
});
<Memoized1 foo="string" />;

const Memoized2 = React.memo(
    function Bar(props: { bar: string }) {
        return null;
    },
    (prevProps, nextProps) => prevProps.bar === nextProps.bar,
);
<Memoized2 bar="string" />;

const Memoized3 = React.memo(class Test extends React.Component<{ x?: string | undefined }> {});
<Memoized3
    ref={ref => {
        if (ref) ref.props.x;
    }}
/>;

const memoized4Ref = React.createRef<HTMLDivElement>();
const Memoized4 = React.memo(React.forwardRef((props: {}, ref: React.Ref<HTMLDivElement>) => <div ref={ref} />));
<Memoized4 ref={memoized4Ref} />;

const Memoized5 = React.memo<{ test: boolean }>(
    prop => <>{prop.test}</>,
    (prevProps, nextProps) => nextProps.test === prevProps.test,
);

<Memoized5 test />;

const Memoized6: React.NamedExoticComponent<object> = React.memo(props => null);
<Memoized6 />;
// @ts-expect-error
<Memoized6 foo />;

// From type-fest
type RequireAllOrNone<ObjectType, KeysType extends keyof ObjectType = never> =
    & (
        | Required<Pick<ObjectType, KeysType>>
        | Partial<Record<KeysType, never>>
    )
    & Omit<ObjectType, KeysType>;

type MemoizedProps = RequireAllOrNone<{ foo: string; bar: number }, "foo" | "bar">;
declare module "react" {
    namespace JSX {
        interface IntrinsicElements {
            "memoized-element": MemoizedProps;
        }
    }
}
// $ExpectType Element
<memoized-element />;
// $ExpectType Element
<memoized-element foo="f" bar={42} />;
// @ts-expect-error
<memoized-element bar={42} />;

const Memoized8 = React.memo((props: MemoizedProps) => <div />);
// $ExpectType Element
<Memoized8 />;
// $ExpectType Element
<Memoized8 foo="" bar={42} />;
// @ts-expect-error
<Memoized8 bar={42} />;

const LazyClassComponent = React.lazy(async () => ({ default: ComponentWithPropsAndState }));
const LazyMemoized3 = React.lazy(async () => ({ default: Memoized3 }));
const LazyRefForwarding = React.lazy(async () => ({ default: Memoized4 }));

<React.Suspense fallback={<Memoized1 foo="string" />}>
    <LazyClassComponent hello="test" />
    <LazyClassComponent
        ref={ref => {
            if (ref) ref.props.hello;
        }}
        hello="test"
    />
    <LazyMemoized3
        ref={ref => {
            if (ref) ref.props.x;
        }}
    />
    <LazyRefForwarding ref={memoized4Ref} />
</React.Suspense>;

<React.Suspense fallback={null} />;
<React.Suspense />;

// unstable API should not be part of the typings
// @ts-expect-error
<React.Suspense fallback={null} unstable_avoidThisFallback />;

<React.Suspense
    fallback={null}
    // @ts-expect-error -- Should use `name`
    id="test"
/>;
<React.Suspense fallback={null} name="test" />;

class NewContext extends React.Component {
    static contextType = Context;
    context: React.ContextType<typeof Context> = "";

    render() {
        // $ExpectType string
        this.context;
        return this.context;
    }
}

const ForwardRef = React.forwardRef((props: JSX.IntrinsicElements["div"], ref?: React.Ref<HTMLDivElement>) => (
    <div {...props} ref={ref} />
));
const ForwardRef2 = React.forwardRef((
    props: React.ComponentProps<typeof ForwardRef>,
    ref?: React.Ref<HTMLDivElement>,
) => <ForwardRef {...props} ref={ref} />);
const divFnRef = (ref: HTMLDivElement | null) => {/* empty */};
const divRef = React.createRef<HTMLDivElement>();
/**
 * This should be fine to give React to manage i.e. pass it to `<div ref />`.
 * However, TypeScript has no notion of write-only properties: https://github.com/microsoft/TypeScript/issues/21759
 */
const badlyAuthoredRef: React.RefObject<HTMLDivElement | null | undefined> = { current: undefined };

// deprecated
React.createElement(ForwardRef).ref;
<ForwardRef ref={divFnRef} />;
<ForwardRef ref={divRef} />;
// @ts-expect-error string refs are no longer supported
<ForwardRef ref="string" />;
<ForwardRef2 ref={divFnRef} />;
<ForwardRef2 ref={divRef} />;
// @ts-expect-error string refs are no longer supported
<ForwardRef2 ref="string" />;
// @ts-expect-error Undesired behavior
<ForwardRef2 ref={badlyAuthoredRef} />;

const htmlElementFnRef = (instance: HTMLElement | null) => {};
const htmlElementRef = React.createRef<HTMLElement>();
<div ref={htmlElementFnRef} />;
<div ref={htmlElementRef} />;
// `current` is nullable
const unsoundDivFnRef = (current: HTMLDivElement) => {};
declare const unsoundDivObjectRef: { current: HTMLDivElement };
// `current` is nullable but type-checks
// this is consistent with ref objects
// If this ever not type-checks, `<div ref={unsoundDivObjectRef}` should also fail type-checking
<div ref={unsoundDivFnRef} />;
<div ref={unsoundDivObjectRef} />;

const newContextRef = React.createRef<NewContext>();
<NewContext ref={newContextRef} />;
<NewContext // @ts-expect-error string refs are no longer supported
 ref="string" />;

const ForwardNewContext = React.forwardRef((_props: {}, ref?: React.Ref<NewContext>) => <NewContext ref={ref} />);
<ForwardNewContext ref={newContextRef} />;
// @ts-expect-error string refs are no longer supported
<ForwardNewContext ref="string" />;

const ForwardRef3 = React.forwardRef(
    (
        props:
            & JSX.IntrinsicElements["div"]
            & Pick<JSX.IntrinsicElements["div"] & { theme?: {} | undefined }, "ref" | "theme">,
        ref?: React.Ref<HTMLDivElement>,
    ) => <div {...props} ref={ref} />,
);

<ForwardRef3 ref={divFnRef} />;
<ForwardRef3 ref={divRef} />;

function ModernForwardRef(props: { ref?: React.Ref<HTMLDivElement> }) {
    return <div ref={props.ref} />;
}
const modernForwardRefElement = (
    <ModernForwardRef
        ref={current => {
            // $ExpectType HTMLDivElement | null
            current;
        }}
    />
);
// @ts-expect-error
modernForwardRefElement.ref;
// $ExpectType Ref<HTMLDivElement> | undefined
type ModernForwardRefPropsRef = React.ComponentPropsWithRef<typeof ModernForwardRef>["ref"];

const { Profiler } = React;

// 'id' is missing
// @ts-expect-error
<Profiler />;
// 'onRender' is missing
// @ts-expect-error
<Profiler id="test" />;
// 'number' is not assignable to 'string'
// @ts-expect-error
<Profiler id={2} />;

<Profiler
    id="test"
    onRender={(
        id,
        phase,
        actualDuration,
        baseDuration,
        startTime,
        commitTime,
    ) => {
        const message = `${id} ${phase} took ${actualDuration.toFixed(2)}s actual, ${baseDuration.toFixed(2)}s base`;

        const commitMessage = `commit started ${startTime.toFixed(2)} within ${commitTime}`;
    }}
>
    <div />
</Profiler>;

type ImgProps = React.ComponentProps<"img">;
const imgProps: ImgProps = {};
// the order of the strings in the union seems to vary
// with the typescript version, so test assignment instead
imgProps.decoding = "async";
imgProps.decoding = "auto";
imgProps.decoding = "sync";
imgProps.loading = "eager";
imgProps.loading = "lazy";
// @ts-expect-error
imgProps.loading = "nonsense";
// @ts-expect-error
imgProps.decoding = "nonsense";
type ImgPropsWithRef = React.ComponentPropsWithRef<"img">;
// $ExpectType Ref<HTMLImageElement> | undefined
type ImgPropsWithRefRef = ImgPropsWithRef["ref"];
type ImgPropsWithoutRef = React.ComponentPropsWithoutRef<"img">;
// $ExpectType false
type ImgPropsHasRef = "ref" extends keyof ImgPropsWithoutRef ? true : false;

const HasClassName: React.ElementType<{ className?: string | undefined }> = "a";
// @ts-expect-error
const HasFoo: React.ElementType<{ foo: boolean }> = "a";
const HasFoo2: React.ElementType<{ foo: boolean }> = (props: { foo: boolean }) => null;
// @ts-expect-error
const HasFoo3: React.ElementType<{ foo: boolean }> = (props: { foo: string }) => null;
const HasHref: React.ElementType<{ href?: string | undefined }> = "a";
// @ts-expect-error
const HasHref2: React.ElementType<{ href?: string | undefined }> = "div";

// @ts-expect-error
const CustomElement: React.ElementType = "my-undeclared-element";

// custom elements need to be declared as intrinsic elements
declare module "react" {
    namespace JSX {
        interface IntrinsicElements {
            "my-declared-element": {};
        }
    }
}

const CustomElement3: React.ElementType = "my-declared-element";
<my-declared-element />;

const CustomTag1: React.ElementType<{ className?: string | undefined }, "a" | "button"> = "a";
const CustomTag2: React.ElementType<{ className?: string | undefined }, "a" | "button"> = "button";
// @ts-expect-error
const CustomTag3: React.ElementType<{ className?: string | undefined }, "a" | "button"> = "div";
const CustomTag4: React.ElementType<{ className?: string | undefined }, "a" | "button"> = (
    props: { className?: string | undefined },
) => <div {...props} />;

function CustomSelect(props: {
    children: ReadonlyArray<
        React.ReactElement<
            React.ComponentPropsWithoutRef<typeof CustomSelectOption>
        >
    >;
}): JSX.Element {
    return (
        (
            <div>
                <ul>{props.children}</ul>
                <select>
                    {React.Children.map(props.children, child => (
                        // key should be mappable from children.
                        <option key={child.key} value={child.props.value}>
                            {child.props.children}
                        </option>
                    ))}
                </select>
            </div>
        )
    );
}
function CustomSelectOption(props: {
    value: string;
    children: React.ReactNode;
}): JSX.Element {
    return <li data-value={props.value}>{props.children}</li>;
}
function Example() {
    return (
        <CustomSelect>
            <CustomSelectOption value="one">One</CustomSelectOption>
            <CustomSelectOption value="two">Two</CustomSelectOption>
        </CustomSelect>
    );
}

function reactNodeTests() {
    function* createChildren() {
        yield <div key="one">one</div>;
        yield <div key="two">two</div>;
    }

    <div>{Object.freeze([<div key="one">one</div>, <div key="two">two</div>])}</div>;
    <div>{new Set([<div key="one">one</div>, <div key="two">two</div>])}</div>;
    // TODO: This warns at runtime so we should probably reject it as well
    <div>
        {new Map([
            ["one", <div key="one">one</div>],
            ["two", <div key="two">two</div>],
        ])}
    </div>;
    <div>{createChildren()}</div>;
    // @ts-expect-error plain objects are not allowed
    <div>{{ dave: true }}</div>;
    <div>{Promise.resolve("React")}</div>;
}

function elementTypeTests() {
    const ReturnVoid = () => {};
    // @ts-expect-error
    const FCVoid: React.FC = ReturnVoid;
    class RenderVoid extends React.Component {
        // @ts-expect-error
        render() {}
    }

    const ReturnUndefined = () => undefined;
    const FCUndefined: React.FC = ReturnUndefined;
    class RenderUndefined extends React.Component {
        render() {
            return undefined;
        }
    }

    const ReturnNull = () => null;
    const FCNull: React.FC = ReturnNull;
    class RenderNull extends React.Component {
        render() {
            return null;
        }
    }

    const ReturnNumber = () => 0xeac1;
    const FCNumber: React.FC = ReturnNumber;
    class RenderNumber extends React.Component {
        render() {
            return 0xeac1;
        }
    }

    const ReturnString = () => "Hello, Dave!";
    const FCString: React.FC = ReturnString;
    class RenderString extends React.Component {
        render() {
            return "Hello, Dave!";
        }
    }

    const ReturnSymbol = () => Symbol.for("react");
    // @ts-expect-error
    const FCSymbol: React.FC = ReturnSymbol;
    class RenderSymbol extends React.Component {
        // @ts-expect-error
        render() {
            return Symbol.for("react");
        }
    }

    const ReturnArray = () => [<div key="one" />];
    const FCVArray: React.FC = ReturnArray;
    class RenderArray extends React.Component {
        render() {
            return [<div key="one" />];
        }
    }

    const ReturnElement = () => <div />;
    const FCElement: React.FC = ReturnElement;
    class RenderElement extends React.Component {
        render() {
            return <div />;
        }
    }

    const ReturnReactNode = ({ children }: { children?: React.ReactNode }) => children;
    const FCReactNode: React.FC = ReturnReactNode;
    class RenderReactNode extends React.Component<{ children?: React.ReactNode }> {
        render() {
            return this.props.children;
        }
    }

    const ReturnPromise = () => Promise.resolve("React");
    const FCPromise: React.FC = ReturnPromise;
    class RenderPromise extends React.Component {
        render() {
            return Promise.resolve("React");
        }
    }

    const ReturnPromiseReactNode = async ({ children }: { children?: React.ReactNode }): Promise<React.ReactNode> =>
        children;
    const FCPromiseReactNode: React.FC = ReturnReactNode;
    class RenderPromiseReactNode extends React.Component<{ children?: React.ReactNode }> {
        // Undesired behavior.
        // Class components cannot have an async `render`.
        // However, they can return a `Promise` by just returning `props.children`.
        // We can't differentiate this case from the desired behavior in TypeScript.
        // `async render` would have to be linted against instead.
        async render() {
            return this.props.children;
        }
    }

    const ReturnWithLegacyContext = (props: { foo: string }, context: { bar: number }) => {
        return (
            <div>
                foo: {props.foo}, bar: {context.bar}
            </div>
        );
    };
    // @ts-expect-error -- legacy context was removed
    const FCWithLegacyContext: React.FC<{ foo: string }> = ReturnWithLegacyContext;

    // Desired behavior.
    // @ts-expect-error
    <ReturnVoid />;
    // @ts-expect-error
    React.createElement(ReturnVoid);
    // @ts-expect-error
    <RenderVoid />;
    // @ts-expect-error
    React.createElement(RenderVoid);

    // Desired behavior.
    <ReturnUndefined />;
    React.createElement(ReturnUndefined);
    <RenderUndefined />;
    React.createElement(RenderUndefined);

    // Desired behavior.
    <ReturnNull />;
    React.createElement(ReturnNull);
    <RenderNull />;
    React.createElement(RenderNull);

    // Desired behavior.
    <ReturnNumber />;
    React.createElement(ReturnNumber);
    <RenderNumber />;
    React.createElement(RenderNumber);

    // Desired behavior.
    <ReturnString />;
    React.createElement(ReturnString);
    <RenderString />;
    React.createElement(RenderString);

    // Desired behavior.
    // @ts-expect-error
    <ReturnSymbol />;
    // @ts-expect-error
    React.createElement(ReturnSymbol);
    // @ts-expect-error
    <RenderSymbol />;
    // @ts-expect-error
    React.createElement(RenderSymbol);

    <ReturnArray />;
    React.createElement(ReturnArray);
    <RenderArray />;
    React.createElement(RenderArray);

    // Desired behavior.
    <ReturnElement />;
    React.createElement(ReturnElement);
    <RenderElement />;
    React.createElement(RenderElement);

    // Desired behavior.
    <ReturnReactNode />;
    React.createElement(ReturnReactNode);
    <RenderReactNode />;
    React.createElement(RenderReactNode);

    <ReturnPromise />;
    React.createElement(ReturnPromise);
    <RenderPromise />;
    React.createElement(RenderPromise);

    <ReturnPromiseReactNode />;
    React.createElement(ReturnPromiseReactNode);
    <FCPromiseReactNode />;
    React.createElement(FCPromiseReactNode);

    // @ts-expect-error -- legacy context was removed
    <ReturnWithLegacyContext foo="one" />;
    // @ts-expect-error -- legacy context was removed
    React.createElement(ReturnWithLegacyContext, { foo: "one" });

    // @ts-expect-error -- legacy context was removed
    <RenderWithLegacyContext />;
    // @ts-expect-error -- legacy context was removed
    React.createElement(RenderWithLegacyContext);
}

function managingRefs() {
    const genericRefBad = React.useRef<Element>(undefined);
    // $ExpectType Element | undefined
    genericRefBad.current;
    const genericRef = React.useRef<Element>(null);
    // $ExpectType Element | null
    genericRef.current;

    const inputRefBad = React.useRef<HTMLInputElement>(undefined);
    // $ExpectType HTMLInputElement | undefined
    inputRefBad.current;
    const inputRef = React.useRef<HTMLInputElement>(null);
    // $ExpectType HTMLInputElement | null
    inputRef.current;

    // @ts-expect-error: Type 'undefined' is not assignable to type 'HTMLInputElement | null'
    <input ref={genericRefBad} />;
    <input ref={genericRef} />;
    // @ts-expect-error: Type 'undefined' is not assignable to type 'HTMLInputElement | null'
    <input ref={inputRefBad} />;
    <input ref={inputRef} />;
    // @ts-expect-error: Type 'undefined' is not assignable to type 'HTMLInputElement | null'
    <div ref={inputRefBad} />;
    // Undesired. Should not typecheck since
    // `inputRef.current` will contain `HTMLDivElement | null` at runtime
    // while it has `HTMLInputElement | null` at compiletime.
    <div ref={inputRef} />;

    const ElementComponent = React.forwardRef<Element>((_, ref) => {
        if (typeof ref === "object" && ref !== null) {
            // $ExpectType Element | null
            ref.current;
        }
        return <div ref={ref} />;
    });
    // @ts-expect-error Type 'undefined' is not assignable to type 'Element | null'
    <ElementComponent ref={genericRefBad} />;
    <ElementComponent ref={genericRef} />;
    // @ts-expect-error Type 'undefined' is not assignable to type 'Element | null'
    <ElementComponent ref={inputRefBad} />;
    // Undesired, should not typecheck since
    // `inputRef.current` will contain `Element | null` at runtime
    // while it has `HTMLInputElement | null` at compiletime.
    <ElementComponent ref={inputRef} />;
    // ref cleanup
    const ref: React.RefCallback<HTMLDivElement> = current => {
        // Should be non-nullable
        // $ExpectType HTMLDivElement | null
        current;
        return function refCleanup() {
        };
    };
    <div
        ref={current => {
            // Should be non-nullable
            // $ExpectType HTMLDivElement | null
            current;
            return function refCleanup() {
            };
        }}
    />;
    <div
        // @ts-expect-error ref cleanup does not accept arguments
        ref={current => {
            // @ts-expect-error
            return function refCleanup(implicitAny) {
            };
        }}
    />;
    <div
        // @ts-expect-error ref cleanup does not accept arguments
        ref={current => {
            return function refCleanup(neverPassed: string) {
            };
        }}
    />;
}

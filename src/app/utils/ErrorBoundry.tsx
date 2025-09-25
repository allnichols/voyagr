import React from "react";

type Props = { children: React.ReactNode };

type State = { hasError: boolean; error: any | null };

export default class ErrorBoundary extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error: any) {
        return { hasError: true, error };
    }

    componentDidCatch(error: any, errorInfo: any) {
        console.error("ErrorBoundary caught an error", error, errorInfo);
    }

    render() {
        if(this.state.hasError){
            return (
                <div>
                    Failed to load map
                </div>
            )
        }
        return this.props.children;
    }
}
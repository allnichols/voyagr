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

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center h-full">
          <p>Failed to load map</p>
          <button
            className="btn btn-primary rounded-sm"
            onClick={this.handleReset}
          >
            Refresh Map
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

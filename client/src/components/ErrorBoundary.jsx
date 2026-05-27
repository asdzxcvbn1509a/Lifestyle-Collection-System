import { Component } from 'react';

// Catches render-time errors anywhere in the tree and shows a fallback
// instead of a blank screen. Error boundaries must be class components.
export default class ErrorBoundary extends Component {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    console.error('Render error:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen flex-col items-center justify-center gap-3 bg-slate-50 p-6 text-center dark:bg-slate-950">
          <h1 className="text-xl font-bold">เกิดข้อผิดพลาด</h1>
          <p className="text-slate-500 dark:text-slate-400">ขออภัย มีบางอย่างผิดพลาด ลองโหลดหน้าใหม่อีกครั้ง</p>
          <button className="btn-primary" onClick={() => location.reload()}>
            โหลดใหม่
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

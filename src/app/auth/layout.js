export default function layout({ children }) {
    return <div className="absolute top-0 left-0 right-0 bottom-0 z-1">
        {children}
    </div>
}
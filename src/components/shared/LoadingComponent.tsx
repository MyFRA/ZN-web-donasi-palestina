import { BounceLoader } from 'react-spinners';

export default function LoadingComponent({ loading }: { loading: boolean }) {
    const cssOverride = {

    };

    return (
        <div className={`fixed top-0 left-0 z-50 w-full h-screen flex items-center justify-center ${loading ? '' : 'hidden'}`} style={{ background: 'rgba(0, 0, 0, 0.3)' }}>
            <BounceLoader
                color={'#2563EB'}
                loading={loading}
                cssOverride={cssOverride}
                size={50}
                aria-label="Loading Spinner"
                data-testid="loader"
            />
        </div>
    )
}
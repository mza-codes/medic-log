import './Loader.css';

const Loader = () => {
    return (
        <main className='loaderParent'>
            <div className="lds-ellipsis ">
                <div />
                <div />
                <div />
                <div />
            </div>
        </main>
    );
};

export default Loader
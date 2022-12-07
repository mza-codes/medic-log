import './Loader.css';

const Loader = ({ inline }) => {
    return (
        <main className={inline ? "loaderSm" : `loaderParent`}>
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
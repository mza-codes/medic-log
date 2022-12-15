import AvatarSection from "./Forms/AvatarSection";
import HTMLParser from "./Forms/HTMLParser";
import RTF from "./Forms/RichTextEditor";

const Documenter = () => {

    return (
        <div className="max-w-[100vw] p-2 flex flex-col items-center justify-center">
            <h1 className="text-4xl my-2 text-center">Add Patient Log</h1>
            <RTF />
            <h1 className="text-3xl my-4 text-center">View Patient Log</h1>
            <section className="relative">
                <HTMLParser />
                <AvatarSection />
            </section>
        </div>
    );
};

export default Documenter;
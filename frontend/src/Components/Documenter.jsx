import useLocalState from "../Services/LocalState";
import AvatarSection from "./Forms/AvatarSection";
import HTMLParser from "./Forms/HTMLParser";
import RTF from "./Forms/RichTextEditor";

const Documenter = () => {
    console.log("Documneter Renderd");

    return (
        <div className="max-w-[100vw] p-2 flex flex-col items-center justify-center xl:flex-row gap-2 xl:items-start">
            <main>
                <h1 className="text-4xl my-2 text-center w-full">Add Patient Log</h1>
                <RTF />
            </main>
            <main>
                <h1 className="text-3xl my-3 text-center w-full">View Patient Log</h1>
                <section className="relative">
                    <HTMLParser />
                    <AvatarSection />
                </section>
            </main>
        </div>
    );
};

export default Documenter;
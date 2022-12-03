import bg from '../Assets/bg-small.jpg';
import LoginForm from './AuthSection/LoginForm';

const Homepage = () => {
  return (
    <main style={{ backgroundImage: `url(${bg})` }} className='w-full min-h-[94vh] bg-cover'>

      <section className='w-full min-h-[90vh] flex flex-col items-center justify-center'>
        <h1 className='text-4xl font-semibold underline mb-8'>Login</h1>
        <LoginForm />
      </section>

    </main>
  );
};

export default Homepage;
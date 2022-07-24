import type { NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { Button } from "../components/atomic";

const Home: NextPage = () => {
  const router = useRouter();
  return (
    <div className="h-full">
      <Head>
        <title>Tally</title>
        <meta name="description" content="Vote on stuff" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="h-full w-full flex flex-col items-center justify-center">
        <div className="text-7xl">Tally</div>
        <div className="h-8"></div>
        <div className="text-md">Anonymously vote on stuff.</div>
        <div className="h-12"></div>

        <Button
          onClick={() => {
            router.push("/create");
          }}
        >
          Create a tally
        </Button>
      </div>
    </div>
  );
};

export default Home;

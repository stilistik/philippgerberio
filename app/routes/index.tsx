import { MainHeader } from "~/components/layout/MainHeader";
import { SubHeader } from "~/components/layout/SubHeader";

export default function Index() {
  return (
    <div className="grid grid-cols-2 gap-20">
      <div>
        <MainHeader>
          Hi! I'm Philipp. <br />I like technology and the web.
        </MainHeader>
        <SubHeader>
          I write about the problems i solve, the solutions i come up with and
          the tools i use to implement these solutions. I also like to catch
          Pokemon in my free time.
        </SubHeader>
      </div>
      <img src="me.jpeg" alt="Me" className="rounded-full shadow-2xl mt-10" />
    </div>
  );
}

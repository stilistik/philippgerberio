import { PageLayout } from "~/components/main/PageLayout";

function computeAge(birthdate: Date) {
  const diff_ms = Date.now() - birthdate.getTime();
  const age_dt = new Date(diff_ms);
  return Math.abs(age_dt.getUTCFullYear() - 1970);
}

export default function About() {
  return (
    <PageLayout>
      <main>
        <h1 className="col-start-1">About</h1>
        <img
          className="rounded-lg shadow-lg col-span-12 sm:col-span-4 sm:col-start-9 sm:row-start-2 mt-0 mb-5 sm:m-0"
          src="me.jpeg"
          alt="A picture of me"
        />
        <article className="col-span-12 sm:col-span-8 sm:col-start-1 sm:col-end-8 sm:row-start-2">
          <p>
            My name is Philipp Gerber, I am{" "}
            {computeAge(new Date("13. April 1991"))} years old and was born and
            still live in Bern, Switzerland. I have a small family with a{" "}
            {computeAge(new Date("7. May 2021"))} year old daughter who has
            become the main focus of my attention since she set foot in this
            world. Besides being a father, I have a profound interest in all
            things technology as well as art, specifically music.
          </p>

          <p>
            In terms of formal education, I have a BSc in Biomedical Sciences
            from the University of Fribourg and a MSc in Biomedical Engineering
            from the University of Bern. During my master's degree I discovered
            my passion for technology and specifically programming and computer
            science. The result of this discovery were countless software
            engineering side projects that were hidden away from the public in
            private git repositories. One of the main purposes of this blogfolio
            page is to give these projects some visibility.
          </p>

          <p>
            Another topic I am passionate about is music. I have taken 21 years
            of piano lessons starting at age 6. When it became possible to
            produce music from my bedroom using simple tools such as a laptop
            and a MIDI keyboard, this provided a huge outlet for my creativity.
            The result was an artist pseudonym called{" "}
            <a href="https://open.spotify.com/artist/7ixfqfcoQWj1dtRACpptEG">
              Kredo
            </a>{" "}
            which now has some songs with more than 2 million plays on Spotify.
          </p>

          <p>
            Professionally I am currently working as a senior software engineer
            at a medical startup company called{" "}
            <a href="https://retinai.com">RetinAI</a> where I am leading and
            building the frontend team.
          </p>
        </article>
      </main>
    </PageLayout>
  );
}

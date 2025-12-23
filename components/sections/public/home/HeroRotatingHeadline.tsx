import { RotatingWords } from './RotatingWords';

export function HeroRotatingHeadline() {
  return (
    <h1 className="text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl">
      Your gateway to&nbsp;
      <RotatingWords
        words={[
          { text: 'buy', color: 'text-orange-400' },
          { text: 'invest in', color: 'text-green-400' },
          { text: 'own', color: 'text-blue-400' },
          { text: 'secure', color: 'text-purple-400' },
          { text: 'grow through', color: 'text-pink-400' },
        ]}
      />
      &nbsp;global properties
    </h1>
  );
}

type EduTrackLogoProps = {
  subtitle?: string;
};

export function EduTrackLogo({ subtitle }: EduTrackLogoProps) {
  return (
    <div className="text-center">
      <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight text-petrol-blue-deep drop-shadow-[0_8px_10px_rgba(15,76,92,0.22)] [text-shadow:_0_1px_0_#fff,_0_2px_0_#d5e8ec,_0_3px_0_#bfdce2,_0_8px_14px_rgba(15,76,92,.23)]">
        EduTrack
      </h1>
      <p className="mt-2 text-sm md:text-base text-slate-600">
        {subtitle ?? "Intelligence pedagogique pour la reussite"}
      </p>
    </div>
  );
}

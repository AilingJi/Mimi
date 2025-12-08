type Props = {
  name: string;
};

export default function WelcomeCard({ name }: Props) {
  return (
    <section
      style={{
        maxWidth: 560,
        borderRadius: 12,
        padding: 20,
        boxShadow: "0 6px 18px rgba(0,0,0,0.08)",
      }}
    >
      <h1 style={{ margin: 0 }}>Welcome, {name} 👋</h1>
      <p style={{ color: "#555" }}>
        This is your first React component. Edit{" "}
        <code>src/components/WelcomeCard.tsx</code> to try things out.
      </p>
    </section>
  );
}

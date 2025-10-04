import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-inner">
        <p>© {new Date().getFullYear()} ShopGlow. All rights reserved.</p>
        <p className="muted">Built with React + Express</p>
      </div>
    </footer>
  );
}



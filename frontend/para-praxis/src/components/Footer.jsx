import {
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaYoutube,
  FaLinkedinIn,
} from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-black/90 border-t-4 border-red-700 text-white">
      <div className="max-w-7xl mx-auto  py-4 grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Company Info */}
        <div>
          <h3 className="text-2xl font-extrabold text-red-500 mb-2">
            Pinnacle Passion Pursuits
          </h3>
          <p className="text-sm text-white/70">
            Igniting your journey to self-mastery and fulfillment, one pursuit
            at a time.
          </p>
        </div>
        {/* Features */}
        <div>
          <h4 className="text-lg font-bold text-yellow-400 mb-2">Features</h4>
          <ul className="space-y-1">
            <li>
              <a
                href="/features/habits"
                className="hover:underline text-white/90"
              >
                Habit Tracker
              </a>
            </li>
            <li>
              <a
                href="/features/journal"
                className="hover:underline text-white/90"
              >
                Daily Journal
              </a>
            </li>
            <li>
              <a
                href="/features/goals"
                className="hover:underline text-white/90"
              >
                Goal Setting
              </a>
            </li>
            <li>
              <a
                href="/features/analytics"
                className="hover:underline text-white/90"
              >
                Analytics
              </a>
            </li>
          </ul>
        </div>
        {/* Account */}
        <div>
          <h4 className="text-lg font-bold text-yellow-400 mb-2">Account</h4>
          <ul className="space-y-1">
            <li>
              <a href="/auth/login" className="hover:underline text-white/90">
                Login
              </a>
            </li>
            <li>
              <a
                href="/auth/register"
                className="hover:underline text-white/90"
              >
                Register
              </a>
            </li>
            <li>
              <a
                href="/account/profile"
                className="hover:underline text-white/90"
              >
                Profile
              </a>
            </li>
            <li>
              <a
                href="/account/settings"
                className="hover:underline text-white/90"
              >
                Settings
              </a>
            </li>
          </ul>
        </div>
        {/* About & Social */}
        <div>
          <h4 className="text-lg font-bold text-yellow-400 mb-2">About</h4>
          <ul className="space-y-1 mb-4">
            <li>
              <a href="/about" className="hover:underline text-white/90">
                About Us
              </a>
            </li>
            <li>
              <a href="/contact" className="hover:underline text-white/90">
                Contact
              </a>
            </li>
            <li>
              <a href="/privacy" className="hover:underline text-white/90">
                Privacy Policy
              </a>
            </li>
          </ul>
          <div>
            <p className="text-sm font-bold text-red-400 mb-2">Follow us</p>
            <div className="flex space-x-4">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener"
                aria-label="Facebook"
                className="text-white/80 hover:text-blue-500 text-xl"
              >
                <FaFacebookF />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener"
                aria-label="Twitter"
                className="text-white/80 hover:text-sky-400 text-xl"
              >
                <FaTwitter />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener"
                aria-label="Instagram"
                className="text-white/80 hover:text-pink-400 text-xl"
              >
                <FaInstagram />
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener"
                aria-label="YouTube"
                className="text-white/80 hover:text-red-500 text-xl"
              >
                <FaYoutube />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener"
                aria-label="LinkedIn"
                className="text-white/80 hover:text-blue-700 text-xl"
              >
                <FaLinkedinIn />
              </a>
            </div>
          </div>
        </div>
      </div>
      <div className="border-t border-red-700 py-4 text-center text-xs text-white/70">
        &copy; {new Date().getFullYear()} Pinnacle Passion Pursuits. All rights
        reserved.
      </div>
    </footer>
  );
}

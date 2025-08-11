import {
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaYoutube,
  FaLinkedinIn,
} from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-white border-t border-slate-200 text-slate-700">
      <div className="max-w-7xl mx-auto  py-4 grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Company Info */}
        <div>
          <h3 className="text-2xl font-extrabold text-blue-600 mb-2">
            Pinnacle Passion Pursuits
          </h3>
          <p className="text-sm text-slate-600">
            Igniting your journey to self-mastery and fulfillment, one pursuit
            at a time.
          </p>
        </div>
        {/* Features */}
        <div>
          <h4 className="text-lg font-bold text-blue-700 mb-2">Features</h4>
          <ul className="space-y-1">
            <li>
              <a href="/features/habits" className="hover:underline">
                Habit Tracker
              </a>
            </li>
            <li>
              <a href="/features/journal" className="hover:underline">
                Daily Journal
              </a>
            </li>
            <li>
              <a href="/features/goals" className="hover:underline">
                Goal Setting
              </a>
            </li>
            <li>
              <a href="/features/analytics" className="hover:underline">
                Analytics
              </a>
            </li>
          </ul>
        </div>
        {/* Account */}
        <div>
          <h4 className="text-lg font-bold text-blue-700 mb-2">Account</h4>
          <ul className="space-y-1">
            <li>
              <a href="/auth/login" className="hover:underline">
                Login
              </a>
            </li>
            <li>
              <a href="/auth/register" className="hover:underline">
                Register
              </a>
            </li>
            <li>
              <a href="/account/profile" className="hover:underline">
                Profile
              </a>
            </li>
            <li>
              <a href="/account/settings" className="hover:underline">
                Settings
              </a>
            </li>
          </ul>
        </div>
        {/* About & Social */}
        <div>
          <h4 className="text-lg font-bold text-blue-700 mb-2">About</h4>
          <ul className="space-y-1 mb-4">
            <li>
              <a href="/about" className="hover:underline">
                About Us
              </a>
            </li>
            <li>
              <a href="/contact" className="hover:underline">
                Contact
              </a>
            </li>
            <li>
              <a href="/privacy" className="hover:underline">
                Privacy Policy
              </a>
            </li>
          </ul>
          <div>
            <p className="text-sm font-bold text-blue-700 mb-2">Follow us</p>
            <div className="flex space-x-4">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener"
                aria-label="Facebook"
                className="text-slate-600 hover:text-blue-500 text-xl"
              >
                <FaFacebookF />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener"
                aria-label="Twitter"
                className="text-slate-600 hover:text-sky-400 text-xl"
              >
                <FaTwitter />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener"
                aria-label="Instagram"
                className="text-slate-600 hover:text-pink-400 text-xl"
              >
                <FaInstagram />
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener"
                aria-label="YouTube"
                className="text-slate-600 hover:text-red-500 text-xl"
              >
                <FaYoutube />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener"
                aria-label="LinkedIn"
                className="text-slate-600 hover:text-blue-700 text-xl"
              >
                <FaLinkedinIn />
              </a>
            </div>
          </div>
        </div>
      </div>
      <div className="border-t border-slate-200 py-4 text-center text-xs text-slate-500">
        &copy; {new Date().getFullYear()} Pinnacle Passion Pursuits. All rights
        reserved.
      </div>
    </footer>
  );
}

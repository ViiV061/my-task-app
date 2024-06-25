const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-4 mt-auto w-full text-center">
      <p className="text-sm">
        &copy; {new Date().getFullYear()} My Task Kanban. All rights reserved.
      </p>
    </footer>
  );
};

export default Footer;

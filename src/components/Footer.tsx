import logo from "@/assets/logo.png";

const Footer = () => {
  return (
    <footer className="bg-foreground py-10">
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Logo & Name */}
          <div className="flex items-center gap-3">
            <img src={logo} alt="Центр оценки и права" className="h-12 w-auto brightness-0 invert" />
          </div>

          {/* Copyright */}
          <div className="text-center md:text-right">
            <p className="text-sm text-primary-foreground/80">
              © {new Date().getFullYear()} ИП Кабиров Альмир Робертович
            </p>
            <p className="text-xs text-primary-foreground/60 mt-1">
              Независимая оценка имущества в Республике Башкортостан
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

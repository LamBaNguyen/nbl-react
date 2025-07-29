import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";

export default function ThankYou() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <motion.div
      className="flex flex-col items-center justify-center h-[70vh] text-center"
      initial={{ opacity: 0, y: -30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <motion.h1
        className="text-3xl font-bold text-green-600"
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        {t("thankyou.title")}
      </motion.h1>
      <motion.p
        className="mt-3 text-lg text-gray-700 max-w-md"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        {t("thankyou.message")}
      </motion.p>
      <motion.button
        onClick={() => navigate("/")}
        className="mt-6 bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {t("thankyou.back")}
      </motion.button>
    </motion.div>
  );
}

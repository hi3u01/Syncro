import { useState, useEffect } from "react";
import API from "../services/api";
import { History as HistoryIcon } from "lucide-react";
import PageHeader from "../components/PageHeader";
import ReportHistory from "../components/reports/ReportHistory";

const History = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const { data } = await API.get("/reports");
        setReports(data);
      } catch (error) {
        console.error("Chyba při načítání historie:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchReports();
  }, []);

  return (
    <div className="w-full max-w-3xl mx-auto animate-in fade-in duration-500">
      <PageHeader
        title="Historie"
        subtitle="Odeslané dotazníky"
        icon={HistoryIcon}
      />
      {loading ? (
        <p className="text-center text-gray-500 font-medium py-10">
          Načítání...
        </p>
      ) : (
        <ReportHistory
          reports={reports}
          emptyText="Zatím jsi neodeslal žádný dotazník."
        />
      )}
    </div>
  );
};

export default History;

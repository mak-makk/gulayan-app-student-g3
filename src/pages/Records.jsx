import { useState, useEffect, useRef, useCallback } from 'react';
import { FaSearch, FaPlus, FaEdit, FaTrash, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import ModalNewRecord from './records/ModalNewRecord';
import ModalEditRecord from './records/ModalEditRecord';
import PlantLoading from '../components/PlantLoading';
import { api } from '../api';
import { toast } from 'sonner';

function Records() {
  //TODO: add loading icon while ongoing ang loading ng records.
  const [records, setRecords] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [dataToUpdate, setDataToUpdate] = useState(null);
  const [isEditRecord, setIsEditRecord] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  //pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const isInInitialMount = useRef(true);

  const handleSearchPlants = async () => {
    // TODO search from the the backend; in case that all records is not yet loaded
  }
  const handleLoadRecords = async (page = 1, append = false) => {
    try {
      setIsLoading(page === 1);
      setIsLoadingMore(append);
      
      const response = await api.get('/plants', {
        params: {
          page,
          per_page: 10
        }
      });
      
      const newRecords = response.data.data || response.data;
      
      if (append) {
        setRecords(prev => [...prev, ...newRecords]);
      } else {
        setRecords(newRecords);
      }
      
      // Check if there are more records to load
      const totalPages = response.data.last_page || response.data.meta?.last_page || 1;
      const currentPageNum = response.data.current_page || page;
      setTotalPages(totalPages);
      setHasMore(currentPageNum < totalPages);
      setCurrentPage(currentPageNum);
      
    } catch (error) {
      console.error("Error loading records:", error);
      toast.error("Error loading records.");
    } finally {
      setIsLoading(false);
      setIsLoadingMore(false);
    }
  }
  const handleAddRecord = async (formData) => {
    try {
      const response = await api.post('/plants', formData);
      setRecords(prev => [response.data, ...prev]);
      toast.success("New record saved.");
    } catch (error) {
      console.error(error);
      toast.error("Error encountered while saving record.");
    }

    setIsModalOpen(false)
  }
  const handleUpdateRecord = async (data) => {
    try {
      const response = await api.put(`plants/${data.id}`, data);
      setRecords(prev => prev.map(record => 
        record.id === data.id ? response.data : record
      ));
      toast.success("Plant data updated.");
    } catch (error) {
      console.error(error);
      toast.error("Error encountered during update.");
    } finally {
      setIsEditRecord(false);
    }
  }
  const handleDeleteRecord = async (data) => {
    try {
      const isDelete = confirm("Are you sure you want to delete this record?");
      if (isDelete) {
        await api.delete(`plants/${data.id}`, data);
        setRecords(prev => prev?.filter( val => data.id !== val.id))
        toast.success("Plant data deleted.");
      }
    } catch (error) {
      console.error(error)
      toast.error("Error encountered while deleting record.");
    }
  }
  const filteredRecords = records.filter(record =>
    record.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    record.variety?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    record.seedling_source?.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages && page !== currentPage) {
      setCurrentPage(page);
      handleLoadRecords(page, false);
    }
  };

  // initial record loading
  useEffect(() => {
    handleLoadRecords(1, false);
  }, []);
  
  // reset pagination when searching
  useEffect(() => {
    if (isInInitialMount.current) {
      isInInitialMount.current = false;
      return;
    }
    if (searchTerm) {
      setCurrentPage(1);
      setTotalPages(1);
      setHasMore(false);
    } else {
      setCurrentPage(1);
      setHasMore(true);
      handleLoadRecords(1, false);
    }
  }, [searchTerm]);

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div className='flex flex-grow'></div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 
          transition duration-200 flex items-center gap-2 cursor-pointer"
        >
          <FaPlus />
          Add New Record
        </button>
      </div>

      {/* Search Bar */}
      <div className="bg-white rounded-lg shadow-md p-6 border border-gray-100 mb-6">
        <div className="relative">
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search records..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 
              focus:ring-green-500 focus:border-transparent outline-none"
          />
        </div>
      </div>

      {/* Records Table */}
      <div className="bg-white rounded-lg shadow-md border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto max-h-[580px] overflow-y-auto">
          <table className="relative w-full">
            <thead className="bg-green-50 sticky top-0 z-10">
              <tr>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">Plant Name</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">Variety</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">Batch Name</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">Seedling Source</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">Seedling Count</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">Starting Fund</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">Date Planted</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700"></th>
              </tr>
            </thead>
            <tbody>

              {
                isLoading && records.length === 0 ?
                  (
                    <tr>
                      <td colSpan={7} className='py-10'>
                        <PlantLoading size='2xl' variant='pulse' text="Loading records" />
                      </td>
                    </tr>
                  ) : (
                    <>
                      {filteredRecords.map((record) => (
                        <tr key={record.id} className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="py-4 px-6 text-sm text-gray-800 font-medium">{record.name}</td>
                          <td className="py-4 px-6 text-sm text-gray-600">{record?.variety || "-"}</td>
                          <td className="py-4 px-6 text-sm text-gray-600">{record?.batch_name || "-"}</td>
                          <td className="py-4 px-6 text-sm text-gray-800 font-medium">{record?.seedling_source || "-"}</td>
                          <td className="py-4 px-6 text-sm text-gray-600">{record?.seedling_count || "-"}</td>
                          <td className="py-4 px-6 text-sm text-gray-600">{record?.starting_fund || "0"}</td>
                          <td className="py-4 px-6 text-sm text-gray-600">{record?.date_planted || "-"}</td>
                          <td className="py-4 px-6">
                            <div className="flex gap-2">
                              <button className="cursor-pointer text-blue-600 hover:text-blue-700 p-2 hover:bg-blue-50 rounded"
                                title="Edit Record"
                                onClick={() => { setDataToUpdate(record); setIsEditRecord(true) }}>
                                <FaEdit />
                              </button>
                              <button className="cursor-pointer text-red-600 hover:text-red-700 p-2 
                                hover:bg-red-50 rounded"
                                onClick={() => { handleDeleteRecord(record) }}
                                title="Delete Record">
                                <FaTrash />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}

                      {/* loading more indicator */}
                      {
                        isLoadingMore && (
                          <tr>
                            <td colSpan={8} className='py-6'>
                              <PlantLoading size='lg' variant='pulse' text="Loading more records..." />
                            </td>
                          </tr>
                        )
                      }
                      {/* intersection observer target */}
                      {
                        !searchTerm && hasMore && !isLoadingMore && (
                          <tr ref={observerTarget}>
                            <td colSpan={8} className='py-4 text-center text-gray-400 text-sm'>
                              Scroll for more...
                            </td>
                          </tr>
                        )
                      }

                    </>
                  )
              }
            </tbody>
          </table>
        </div>

        {searchTerm && filteredRecords.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No records found matching your search.
          </div>
        )}

        {/* End of Records Indicator */}
        {!hasMore && records.length > 0 && !searchTerm && (
          <div className="text-center py-4 text-gray-400 text-sm border-t border-gray-100">
            No more records to load
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && !searchTerm && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100 bg-gray-50">
            <div className="text-sm text-gray-600">
              Page {currentPage} of {totalPages}
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="p-2 rounded-lg border border-gray-300 bg-white text-gray-600 
                  hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
                title="Previous page"
              >
                <FaChevronLeft size={14} />
              </button>
              
              {/* Page numbers */}
              <div className="flex items-center gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .filter(page => {
                    // Show first page, last page, and pages around current page
                    return page === 1 || page === totalPages || 
                           Math.abs(page - currentPage) <= 1;
                  })
                  .map((page, index, arr) => (
                    <div key={page} className="flex items-center">
                      {index > 0 && arr[index - 1] !== page - 1 && (
                        <span className="px-2 text-gray-400">...</span>
                      )}
                      <button
                        onClick={() => handlePageChange(page)}
                        className={`min-w-[36px] h-9 px-3 rounded-lg text-sm font-medium transition-colors cursor-pointer
                          ${currentPage === page 
                            ? 'bg-green-600 text-white' 
                            : 'bg-white border border-gray-300 text-gray-600 hover:bg-gray-100'
                          }`}
                      >
                        {page}
                      </button>
                    </div>
                  ))}
              </div>

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="p-2 rounded-lg border border-gray-300 bg-white text-gray-600 
                  hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
                title="Next page"
              >
                <FaChevronRight size={14} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modal */}
      <ModalNewRecord
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleAddRecord}
      />

      <ModalEditRecord
        isOpen={isEditRecord}
        onClose={() => setIsEditRecord(false)}
        data={dataToUpdate}
        onSubmit={handleUpdateRecord}
      />
    </div>
  )
}

export default Records

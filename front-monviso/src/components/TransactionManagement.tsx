import React, { useState, useEffect } from 'react';
import { PlusIcon, FilterIcon, SearchIcon, ChevronDownIcon, ChevronUpIcon, TrashIcon, EditIcon, XIcon } from 'lucide-react';
import { onboardingService, transactionService, categoryService } from '../services/api';
import { useSearchParams } from 'react-router-dom';

interface Income {
  id: number;
  name: string;
  amount: number;
  type: string;
  frequency: string;
  is_primary: boolean;
}

interface Expense {
  id: number;
  name: string;
  amount: number;
  type: string;
  frequency: string;
}

interface Transaction {
  id: string;
  name: string;
  amount: number;
  type: string;
  frequency: string;
  category: string;
  date: string;
  paymentMethod: string;
}

interface Category {
  id: number;
  name: string;
  type: 'income' | 'expense';
  icon?: string;
  color?: string;
}

const TransactionManagement = () => {
  const [showFilters, setShowFilters] = useState(false);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // États de pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  // États pour la recherche et les filtres
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Toutes les catégories');
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('Tous les moyens');
  const [minAmount, setMinAmount] = useState('');
  const [maxAmount, setMaxAmount] = useState('');
  const [selectedPeriod, setSelectedPeriod] = useState('Ce mois');
  const [showNewTransactionModal, setShowNewTransactionModal] = useState(false);
  const [showEditTransactionModal, setShowEditTransactionModal] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [newTransaction, setNewTransaction] = useState({
    name: '',
    amount: '',
    type: 'expense',
    category: '',
    date: new Date().toISOString().split('T')[0],
    paymentMethod: '',
    frequency: 'unique'
  });

  const [searchParams, setSearchParams] = useSearchParams();
  
  // État pour les catégories personnalisées
  const [customCategories, setCustomCategories] = useState<Category[]>([]);
  
  // Catégories par défaut organisées par type
  const defaultCategoriesByType = {
    income: ['Revenus'],
    expense: ['Dépenses fixes', 'Dépenses variables', 'Épargne', 'Non catégorisé']
  };
  
  const allDefaultCategories = [...defaultCategoriesByType.income, ...defaultCategoriesByType.expense];

  // Récupérer les catégories personnalisées
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await categoryService.getAll();
        const categories: Category[] = response.data.map((cat: any) => ({
          id: cat.id,
          name: cat.name,
          type: cat.type,
          icon: cat.icon,
          color: cat.color
        }));
        setCustomCategories(categories);
      } catch (error) {
        console.error('Erreur lors de la récupération des catégories:', error);
      }
    };
    
    fetchCategories();
  }, []);

  // Récupérer les données financières au chargement du composant
  useEffect(() => {
    console.log('📊 useEffect triggered - Starting data fetch');
    
    const fetchTransactions = async () => {
      try {
        console.log('🔄 Fetching transactions from API...');
        const response = await transactionService.getAll();
        console.log('✅ Transactions API response:', response);
        
        const realTransactions = response.data.map((transaction: any) => ({
          id: `real-${transaction.id}`,
          name: transaction.name,
          amount: Number(transaction.amount),
          type: transaction.type,
          frequency: transaction.frequency,
          category: transaction.category || 'Non catégorisé',
          date: transaction.date,
          paymentMethod: transaction.payment_method || 'Non spécifié'
        }));
        
        console.log('🔄 Mapped real transactions:', realTransactions);
        return realTransactions;
      } catch (error) {
        console.error('❌ Erreur lors de la récupération des transactions:', error);
        return [];
      }
    };

    const fetchFinancialData = async () => {
      try {
        console.log('🏦 Starting fetchFinancialData...');
        setLoading(true);
        
        console.log('📞 Calling onboardingService.getFinancialData()...');
        const response = await onboardingService.getFinancialData();
        console.log('✅ Financial data response:', response);
        
        const data = response.data;

        // Transformer les revenus en transactions
        const incomeTransactions: Transaction[] = data.incomes.map((income: Income) => ({
          id: `income-${income.id}`,
          name: income.name,
          amount: income.amount,
          type: 'income',
          frequency: income.frequency,
          category: 'Revenus',
          date: new Date().toISOString().split('T')[0],
          paymentMethod: income.is_primary ? 'Virement principal' : 'Virement'
        }));

        // Transformer les dépenses fixes
        const fixedExpenseTransactions: Transaction[] = data.fixed_expenses.map((expense: Expense) => ({
          id: `expense-fixed-${expense.id}`,
          name: expense.name,
          amount: -Math.abs(expense.amount),
          type: 'expense',
          frequency: expense.frequency,
          category: 'Dépenses fixes',
          date: new Date().toISOString().split('T')[0],
          paymentMethod: 'Prélèvement'
        }));

        // Transformer les dépenses variables
        const variableExpenseTransactions: Transaction[] = data.variable_expenses.map((expense: Expense) => ({
          id: `expense-variable-${expense.id}`,
          name: expense.name,
          amount: -Math.abs(expense.amount),
          type: 'expense',
          frequency: expense.frequency,
          category: 'Dépenses variables',
          date: new Date().toISOString().split('T')[0],
          paymentMethod: 'Carte Bancaire'
        }));

        const allTransactions = [
          ...incomeTransactions,
          ...fixedExpenseTransactions,
          ...variableExpenseTransactions
        ];

        // Récupérer aussi les vraies transactions
        const realTransactions = await fetchTransactions();

        setTransactions([...allTransactions, ...realTransactions]);
        setError(null);
      } catch (err) {
        console.error('Erreur lors de la récupération des données financières:', err);
        setError('Impossible de charger les transactions');
      } finally {
        setLoading(false);
      }
    };

    fetchFinancialData();
  }, []);

  useEffect(() => {
    const shouldOpenModal = searchParams.get('new') === '1';
    if (shouldOpenModal && !showNewTransactionModal) {
      setShowNewTransactionModal(true);
      const next = new URLSearchParams(searchParams);
      next.delete('new');
      setSearchParams(next, { replace: true });
    }
  }, [searchParams, setSearchParams, showNewTransactionModal]);

  // Fonction pour obtenir les catégories filtrées par type de transaction
  const getCategoriesForType = (type: 'income' | 'expense') => {
    const defaultCats = defaultCategoriesByType[type] || [];
    const customCats = customCategories.filter(cat => cat.type === type);
    return { defaultCats, customCats };
  };
  
  // Pour le filtre de recherche, inclure toutes les catégories
  const customCategoryNames = customCategories.map(cat => cat.name);
  const allCategoryNames = [...allDefaultCategories, ...customCategoryNames];
  const transactionCategories = Array.from(new Set(transactions.map(t => t.category)));
  const categoriesForFilter = ['Toutes les catégories', ...Array.from(new Set([...allCategoryNames, ...transactionCategories]))];
  
  const paymentMethods = ['Tous les moyens', ...Array.from(new Set(transactions.map(t => t.paymentMethod)))];
  
  // Fonction de filtrage des transactions
  const getFilteredTransactions = () => {
    return transactions.filter(transaction => {
      // Filtre par recherche (nom de transaction)
      const matchesSearch = searchTerm === '' || 
        transaction.name.toLowerCase().includes(searchTerm.toLowerCase());
      
      // Filtre par catégorie
      const matchesCategory = selectedCategory === 'Toutes les catégories' || 
        transaction.category === selectedCategory;
      
      // Filtre par moyen de paiement
      const matchesPaymentMethod = selectedPaymentMethod === 'Tous les moyens' || 
        transaction.paymentMethod === selectedPaymentMethod;
      
      // Filtre par montant minimum
      const matchesMinAmount = minAmount === '' || 
        Math.abs(transaction.amount) >= parseFloat(minAmount);
      
      // Filtre par montant maximum
      const matchesMaxAmount = maxAmount === '' || 
        Math.abs(transaction.amount) <= parseFloat(maxAmount);
      
      // Filtre par période (simplifié pour l'exemple)
      const matchesPeriod = true; // À implémenter selon vos besoins
      
      return matchesSearch && matchesCategory && matchesPaymentMethod && 
             matchesMinAmount && matchesMaxAmount && matchesPeriod;
    });
  };
  
  // Appliquer les filtres
  const filteredTransactions = getFilteredTransactions();
  
  // Logique de pagination sur les transactions filtrées
  const totalItems = filteredTransactions.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalItems);
  const currentTransactions = filteredTransactions.slice(startIndex, endIndex);
  
  // Réinitialiser la page quand les filtres changent
  const resetPagination = () => {
    setCurrentPage(1);
  };
  
  // Fonctions de gestion des filtres
  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    resetPagination();
  };
  
  const handleCategoryChange = (value: string) => {
    setSelectedCategory(value);
    resetPagination();
  };
  
  const handlePaymentMethodChange = (value: string) => {
    setSelectedPaymentMethod(value);
    resetPagination();
  };
  
  const handleMinAmountChange = (value: string) => {
    setMinAmount(value);
    resetPagination();
  };
  
  const handleMaxAmountChange = (value: string) => {
    setMaxAmount(value);
    resetPagination();
  };
  
  const handlePeriodChange = (value: string) => {
    setSelectedPeriod(value);
    resetPagination();
  };

  // Fonctions pour gérer le modal de nouvelle transaction
  const handleNewTransactionChange = (field: string, value: string) => {
    setNewTransaction(prev => {
      const updated = { ...prev, [field]: value };
      
      // Si on change le type, réinitialiser la catégorie pour éviter les incohérences
      if (field === 'type') {
        updated.category = '';
      }
      
      return updated;
    });
    
    // Réinitialiser l'erreur quand l'utilisateur modifie le formulaire
    if (error) {
      setError(null);
    }
  };

  const handleSubmitNewTransaction = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation des champs requis
    if (!newTransaction.name.trim()) {
      setError('Le nom de la transaction est requis');
      return;
    }
    
    if (!newTransaction.amount || parseFloat(newTransaction.amount) <= 0) {
      setError('Le montant doit être supérieur à 0');
      return;
    }
    
    if (!newTransaction.category) {
      setError('Veuillez sélectionner une catégorie');
      return;
    }
    
    if (!newTransaction.paymentMethod) {
      setError('Veuillez sélectionner un moyen de paiement');
      return;
    }
    
    try {
      // Mapper les moyens de paiement vers les codes backend
      const paymentMethodMapping: { [key: string]: string } = {
        'Virement principal': 'transfer',
        'Virement': 'transfer',
        'Carte Bancaire': 'card',
        'Prélèvement': 'transfer',
        'Espèces': 'cash',
        'Chèque': 'check',
        'Autre': 'other',
        'Tous les moyens': 'other'
      };

      // Appeler l'API pour sauvegarder la transaction
      const transactionData = {
        name: newTransaction.name,
        amount: newTransaction.type === 'expense' ? -Math.abs(parseFloat(newTransaction.amount)) : parseFloat(newTransaction.amount),
        type: newTransaction.type,
        category: newTransaction.category,
        date: newTransaction.date,
        payment_method: paymentMethodMapping[newTransaction.paymentMethod] || 'other',
        frequency: newTransaction.frequency
      };
      
      console.log('[FRONTEND] Données à envoyer:', transactionData);
      
      const response = await transactionService.create(transactionData);
      console.log('[FRONTEND] Réponse reçue:', response.data);
      
      // Réinitialiser le formulaire et fermer le modal
      setNewTransaction({
        name: '',
        amount: '',
        type: 'expense',
        category: '',
        date: new Date().toISOString().split('T')[0],
        paymentMethod: '',
        frequency: 'unique'
      });
      setShowNewTransactionModal(false);
      
      // Rafraîchir la liste
      const fetchTransactions = async () => {
        try {
          const response = await transactionService.getAll();
          const realTransactions = response.data.map((transaction: any) => ({
            id: `real-${transaction.id}`,
            name: transaction.name,
            amount: Number(transaction.amount),
            type: transaction.type,
            frequency: transaction.frequency,
            category: transaction.category || 'Non catégorisé',
            date: transaction.date,
            paymentMethod: transaction.payment_method || 'Non spécifié'
          }));
          
          // Remplacer les transactions réelles existantes
          setTransactions(prev => {
            const onboardingTransactions = prev.filter(t => 
              t.id.startsWith('income-') || t.id.startsWith('expense-')
            );
            return [...onboardingTransactions, ...realTransactions];
          });
        } catch (error) {
          console.error('Erreur lors de la récupération des transactions:', error);
        }
      };

      await fetchTransactions();
    } catch (error) {
      console.error('Erreur lors de la création de la transaction:', error);
      console.error('Détails de l\'erreur:', error.response?.data);
      setError('Erreur lors de la création de la transaction');
    }
  };

  const closeModal = () => {
    setShowNewTransactionModal(false);
    setNewTransaction({
      name: '',
      amount: '',
      type: 'expense',
      category: '',
      date: new Date().toISOString().split('T')[0],
      paymentMethod: '',
      frequency: 'unique'
    });
    setError(null); // Réinitialiser l'erreur lors de la fermeture
  };

  const closeEditModal = () => {
    setShowEditTransactionModal(false);
    setEditingTransaction(null);
  };

  const handleEditTransaction = (transaction: Transaction) => {
    setEditingTransaction(transaction);
    setShowEditTransactionModal(true);
  };

  const handleDeleteTransaction = async (transactionId: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette transaction ?')) {
      return;
    }

    try {
      // Extraire l'ID numérique de l'ID de transaction
      const numericId = transactionId.replace(/^(real-|income-|expense-)/, '');
      await transactionService.delete(parseInt(numericId));
      
      // Rafraîchir la liste des transactions
      const fetchTransactions = async () => {
        try {
          const response = await transactionService.getAll();
          const realTransactions = response.data.map((transaction: any) => ({
            id: `real-${transaction.id}`,
            name: transaction.name,
            amount: Number(transaction.amount),
            type: transaction.type,
            frequency: transaction.frequency,
            category: transaction.category || 'Non catégorisé',
            date: transaction.date,
            paymentMethod: transaction.payment_method || 'Non spécifié'
          }));
          
          setTransactions(prev => {
            const onboardingTransactions = prev.filter(t => 
              t.id.startsWith('income-') || t.id.startsWith('expense-')
            );
            return [...onboardingTransactions, ...realTransactions];
          });
        } catch (error) {
          console.error('Erreur lors de la récupération des transactions:', error);
        }
      };

      await fetchTransactions();
    } catch (error) {
      console.error('Erreur lors de la suppression de la transaction:', error);
      setError('Erreur lors de la suppression de la transaction');
    }
  };

  const handleUpdateTransaction = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTransaction) return;

    try {
      const paymentMethodMapping: { [key: string]: string } = {
        'Virement principal': 'transfer',
        'Virement': 'transfer',
        'Carte Bancaire': 'card',
        'Prélèvement': 'transfer',
        'Espèces': 'cash',
        'Chèque': 'check',
        'Autre': 'other',
        'Non spécifié': 'other'
      };

      const transactionData = {
        name: editingTransaction.name,
        amount: editingTransaction.type === 'expense' ? -Math.abs(editingTransaction.amount) : editingTransaction.amount,
        type: editingTransaction.type,
        category: editingTransaction.category,
        date: editingTransaction.date,
        payment_method: paymentMethodMapping[editingTransaction.paymentMethod] || 'other',
        frequency: editingTransaction.frequency
      };
      
      const numericId = editingTransaction.id.replace(/^(real-|income-|expense-)/, '');
      await transactionService.update(parseInt(numericId), transactionData);
      
      closeEditModal();
      
      // Rafraîchir la liste des transactions
      const fetchTransactions = async () => {
        try {
          const response = await transactionService.getAll();
          const realTransactions = response.data.map((transaction: any) => ({
            id: `real-${transaction.id}`,
            name: transaction.name,
            amount: Number(transaction.amount),
            type: transaction.type,
            frequency: transaction.frequency,
            category: transaction.category || 'Non catégorisé',
            date: transaction.date,
            paymentMethod: transaction.payment_method || 'Non spécifié'
          }));
          
          setTransactions(prev => {
            const onboardingTransactions = prev.filter(t => 
              t.id.startsWith('income-') || t.id.startsWith('expense-')
            );
            return [...onboardingTransactions, ...realTransactions];
          });
        } catch (error) {
          console.error('Erreur lors de la récupération des transactions:', error);
        }
      };

      await fetchTransactions();
    } catch (error) {
      console.error('Erreur lors de la mise à jour de la transaction:', error);
      setError('Erreur lors de la mise à jour de la transaction');
    }
  };

  // Fonctions de navigation
  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };
  
  const goToPreviousPage = () => {
    goToPage(currentPage - 1);
  };
  
  const goToNextPage = () => {
    goToPage(currentPage + 1);
  };
  
  // Générer les numéros de pages à afficher
  const getPageNumbers = () => {
    const pages = [];
    const maxPagesToShow = 5;
    
    if (totalPages <= maxPagesToShow) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      const startPage = Math.max(1, currentPage - 2);
      const endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);
      
      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }
    }
    
    return pages;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-300">Chargement des transactions...</div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-red-400">{error}</div>
      </div>
    );
  }
  return (
    <React.Fragment>
      <div className="space-y-6 pb-24 sm:pb-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-purple-300">
          Gestion des transactions
        </h1>
        <button className="inline-flex items-center rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 px-4 py-2 text-sm font-medium text-white shadow-lg shadow-blue-700/20 hover:from-blue-700 hover:to-purple-700 transition-all duration-200" onClick={() =>setShowNewTransactionModal(true)}>
          <PlusIcon size={16} className="mr-2" />
          Nouvelle transaction
        </button>
      </div>
      {/* Search and filters */}
      <div className="space-y-4">
        <div className="flex flex-col space-y-4 md:flex-row md:items-center md:space-y-0 md:space-x-4">
          <div className="relative flex-grow">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <SearchIcon size={16} className="text-gray-400" />
            </div>
            <input type="text" value={searchTerm} onChange={(e) => handleSearchChange(e.target.value)} placeholder="Rechercher des transactions..." className="block w-full rounded-xl border-0 bg-gray-800/50 backdrop-blur-md pl-10 pr-4 py-2.5 text-gray-100 placeholder-gray-400 focus:ring-2 focus:ring-blue-500/50 shadow-lg shadow-black/10" />
          </div>
          <div className="flex items-center space-x-4">
            <button onClick={() => setShowFilters(!showFilters)} className="inline-flex items-center rounded-xl bg-gray-800/50 backdrop-blur-md px-4 py-2.5 text-sm font-medium text-gray-100 shadow-lg shadow-black/10 border border-gray-700/50 hover:bg-gray-700/50 transition-colors">
              <FilterIcon size={16} className="mr-2 text-blue-400" />
              Filtres
              {showFilters ? <ChevronUpIcon size={16} className="ml-2 text-gray-400" /> : <ChevronDownIcon size={16} className="ml-2 text-gray-400" />}
            </button>
            <select value={selectedPeriod} onChange={(e) => handlePeriodChange(e.target.value)} className="rounded-xl border-0 bg-gray-800/50 backdrop-blur-md py-2.5 px-4 text-gray-100 focus:ring-2 focus:ring-blue-500/50 shadow-lg shadow-black/10">
              <option>Ce mois</option>
              <option>Mois précédent</option>
              <option>Les 3 derniers mois</option>
              <option>Cette année</option>
              <option>Personnalisé</option>
            </select>
          </div>
        </div>
        {/* Expanded filters */}
        {showFilters && <div className="grid grid-cols-1 gap-4 rounded-xl bg-gray-800/30 backdrop-blur-md p-5 sm:grid-cols-2 md:grid-cols-4 border border-gray-700/50 shadow-lg shadow-black/10">
            <div>
              <label htmlFor="category-filter" className="block text-sm font-medium text-gray-300">
                Catégorie
              </label>
              <select id="category-filter" value={selectedCategory} onChange={(e) => handleCategoryChange(e.target.value)} className="mt-1 block w-full rounded-xl border-0 bg-gray-800/50 backdrop-blur-md py-2 px-3 text-gray-100 focus:ring-2 focus:ring-blue-500/50 shadow-md shadow-black/10">
                {categoriesForFilter.map(category => <option key={category}>{category}</option>)}
              </select>
            </div>
            <div>
              <label htmlFor="payment-method-filter" className="block text-sm font-medium text-gray-300">
                Moyen de paiement
              </label>
              <select id="payment-method-filter" value={selectedPaymentMethod} onChange={(e) => handlePaymentMethodChange(e.target.value)} className="mt-1 block w-full rounded-xl border-0 bg-gray-800/50 backdrop-blur-md py-2 px-3 text-gray-100 focus:ring-2 focus:ring-blue-500/50 shadow-md shadow-black/10">
                {paymentMethods.map(method => <option key={method}>{method}</option>)}
              </select>
            </div>
            <div>
              <label htmlFor="min-amount" className="block text-sm font-medium text-gray-300">
                Montant minimum
              </label>
              <input type="number" id="min-amount" value={minAmount} onChange={(e) => handleMinAmountChange(e.target.value)} className="mt-1 block w-full rounded-xl border-0 bg-gray-800/50 backdrop-blur-md py-2 px-3 text-gray-100 focus:ring-2 focus:ring-blue-500/50 shadow-md shadow-black/10" placeholder="0" />
            </div>
            <div>
              <label htmlFor="max-amount" className="block text-sm font-medium text-gray-300">
                Montant maximum
              </label>
              <input type="number" id="max-amount" value={maxAmount} onChange={(e) => handleMaxAmountChange(e.target.value)} className="mt-1 block w-full rounded-xl border-0 bg-gray-800/50 backdrop-blur-md py-2 px-3 text-gray-100 focus:ring-2 focus:ring-blue-500/50 shadow-md shadow-black/10" placeholder="5000" />
            </div>
          </div>}
      </div>
      {/* Transactions - Mobile Cards */}
      <div className="block md:hidden space-y-3">
        {currentTransactions.map(transaction => (
          <div
            key={transaction.id}
            className="rounded-xl bg-gradient-to-br from-gray-800/70 to-gray-900/70 backdrop-blur-md border border-gray-700/50 p-4 shadow-lg"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <h3 className="text-base font-semibold text-white mb-1">{transaction.name}</h3>
                <p className="text-xs text-gray-400">{new Date(transaction.date).toLocaleDateString('fr-FR')}</p>
              </div>
              <div className={`text-right ${transaction.amount >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                <p className="text-lg font-bold">
                  {transaction.amount >= 0 ? `+${Number(transaction.amount).toFixed(2)} €` : `${Number(transaction.amount).toFixed(2)} €`}
                </p>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <span className="inline-flex items-center rounded-full bg-blue-500/20 px-2.5 py-1 text-xs text-blue-200">
                {transaction.category}
              </span>
              <span className="inline-flex items-center rounded-full bg-gray-700/50 px-2.5 py-1 text-xs text-gray-300">
                {transaction.paymentMethod}
              </span>
            </div>
            <div className="flex items-center justify-end gap-3 pt-2 border-t border-gray-700/30">
              <button
                onClick={() => handleEditTransaction(transaction)}
                className="flex items-center gap-1.5 rounded-lg bg-blue-500/20 px-3 py-1.5 text-sm text-blue-300 hover:bg-blue-500/30 transition-colors"
              >
                <EditIcon size={14} />
                Modifier
              </button>
              <button
                onClick={() => handleDeleteTransaction(transaction.id)}
                className="flex items-center gap-1.5 rounded-lg bg-red-500/20 px-3 py-1.5 text-sm text-red-300 hover:bg-red-500/30 transition-colors"
              >
                <TrashIcon size={14} />
                Supprimer
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Transactions - Desktop Table */}
      <div className="hidden md:block overflow-hidden rounded-xl bg-gradient-to-br from-gray-800/70 to-gray-900/70 backdrop-blur-md border border-gray-700/50 shadow-xl">
        <div className="max-w-full">
          <table className="w-full table-auto divide-y divide-gray-700/30">
            <thead className="bg-gray-800/50">
              <tr>
                <th scope="col" className="px-4 py-3.5 text-left text-xs font-medium uppercase tracking-wider text-gray-300">
                  Date
                </th>
                <th scope="col" className="px-4 py-3.5 text-left text-xs font-medium uppercase tracking-wider text-gray-300">
                  Description
                </th>
                <th scope="col" className="px-4 py-3.5 text-left text-xs font-medium uppercase tracking-wider text-gray-300">
                  Catégorie
                </th>
                <th scope="col" className="px-4 py-3.5 text-left text-xs font-medium uppercase tracking-wider text-gray-300">
                  Moyen de paiement
                </th>
                <th scope="col" className="px-4 py-3.5 text-right text-xs font-medium uppercase tracking-wider text-gray-300">
                  Montant
                </th>
                <th scope="col" className="px-4 py-3.5 text-right text-xs font-medium uppercase tracking-wider text-gray-300">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700/30 bg-transparent">
              {currentTransactions.map(transaction => (
                <tr key={transaction.id} className="hover:bg-white/5 transition-colors">
                  <td className="px-4 py-4 text-sm text-gray-300 align-top">
                    {new Date(transaction.date).toLocaleDateString('fr-FR')}
                  </td>
                  <td className="px-4 py-4 text-sm font-medium text-gray-100 align-top break-words">
                    {transaction.name}
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-300 align-top break-words">
                    {transaction.category}
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-300 align-top break-words">
                    {transaction.paymentMethod}
                  </td>
                  <td className={`px-4 py-4 text-right text-sm font-medium align-top ${transaction.amount >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {transaction.amount >= 0 ? `+${Number(transaction.amount).toFixed(2)} €` : `${Number(transaction.amount).toFixed(2)} €`}
                  </td>
                  <td className="px-4 py-4 text-right text-sm align-top">
                    <button
                      onClick={() => handleEditTransaction(transaction)}
                      className="text-blue-400 hover:text-blue-300 mr-3 transition-colors"
                      title="Modifier la transaction"
                    >
                      <EditIcon size={16} />
                    </button>
                    <button
                      onClick={() => handleDeleteTransaction(transaction.id)}
                      className="text-red-400 hover:text-red-300 transition-colors"
                      title="Supprimer la transaction"
                    >
                      <TrashIcon size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      <div className="rounded-xl bg-gradient-to-br from-gray-800/70 to-gray-900/70 backdrop-blur-md border border-gray-700/50 px-4 py-3 flex items-center justify-between">
        <div className="flex-1 flex justify-between md:hidden">
          <button onClick={goToPreviousPage} disabled={currentPage === 1} className="relative inline-flex items-center px-4 py-2 border border-gray-700/50 text-sm font-medium rounded-xl text-gray-300 bg-gray-800/50 hover:bg-gray-700/50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
            Précédent
          </button>
          <button onClick={goToNextPage} disabled={currentPage === totalPages} className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-700/50 text-sm font-medium rounded-xl text-gray-300 bg-gray-800/50 hover:bg-gray-700/50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
            Suivant
          </button>
        </div>
        <div className="hidden md:flex md:flex-1 md:items-center md:justify-between">
            <div>
              <p className="text-sm text-gray-300">
                Affichage de{' '}
                <span className="font-medium text-gray-100">{startIndex + 1}</span> à{' '}
                <span className="font-medium text-gray-100">{endIndex}</span> sur{' '}
                <span className="font-medium text-gray-100">{totalItems}</span>{' '}
                transactions
              </p>
            </div>
            <div>
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                <button onClick={goToPreviousPage} className="relative inline-flex items-center px-2 py-2 rounded-l-xl border border-gray-700/50 bg-gray-800/50 text-sm font-medium text-gray-300 hover:bg-gray-700/50 transition-colors">
                  <span className="sr-only">Précédent</span>
                  <ChevronUpIcon size={16} className="rotate-90" />
                </button>
                {getPageNumbers().map(page => (
                  <button key={page} onClick={() => goToPage(page)} className={`relative inline-flex items-center px-4 py-2 border border-gray-700/50 bg-gray-800/50 text-sm font-medium text-gray-300 hover:bg-gray-700/50 transition-colors ${currentPage === page ? 'bg-blue-600/50 text-blue-200' : ''}`}>
                    {page}
                  </button>
                ))}
                <button onClick={goToNextPage} className="relative inline-flex items-center px-2 py-2 rounded-r-xl border border-gray-700/50 bg-gray-800/50 text-sm font-medium text-gray-300 hover:bg-gray-700/50 transition-colors">
                  <span className="sr-only">Suivant</span>
                  <ChevronDownIcon size={16} className="rotate-90" />
                </button>
              </nav>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de nouvelle transaction */}
      {showNewTransactionModal && (
        <div className="fixed inset-0 z-50 flex flex-col justify-end sm:justify-center">
          <div
            className="absolute inset-0 bg-gray-900/70 backdrop-blur-sm"
            onClick={closeModal}
          />
          <div className="relative w-full sm:max-w-lg sm:mx-auto" onClick={(e) => e.stopPropagation()}>
            <form
              onSubmit={handleSubmitNewTransaction}
              className="relative flex max-h-[85vh] flex-col rounded-t-3xl border border-gray-700/40 bg-gradient-to-br from-gray-900/95 to-gray-800/95 shadow-2xl sm:rounded-2xl"
            >
              <div className="flex items-center justify-center py-3">
                <div className="h-1.5 w-14 rounded-full bg-gray-600" />
              </div>
              <div className="flex items-center justify-between px-6 pb-4">
                <div>
                  <h2 className="text-lg font-bold text-gray-100" id="modal-headline">
                    Nouvelle transaction
                  </h2>
                  <p className="text-xs text-gray-400">
                    Renseignez les détails pour suivre cette dépense ou ce revenu.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={closeModal}
                  className="rounded-full bg-gray-800/60 p-2 text-gray-300 transition hover:text-white"
                >
                  <XIcon size={16} />
                </button>
              </div>

              <div className="flex-1 space-y-6 overflow-y-auto px-6 pb-6">
                {error && (
                  <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-100">
                    {error}
                  </div>
                )}
                
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-300">
                    Nom de la transaction
                  </label>
                  <input
                    type="text"
                    id="name"
                    value={newTransaction.name}
                    onChange={(e) => handleNewTransactionChange('name', e.target.value)}
                    className="mt-1 block w-full rounded-xl border-0 bg-gray-800/60 py-2 px-3 text-gray-100 shadow-inner shadow-black/20 focus:ring-2 focus:ring-blue-500/50"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label htmlFor="amount" className="block text-sm font-medium text-gray-300">
                      Montant
                    </label>
                    <input
                      type="number"
                      id="amount"
                      step="0.01"
                      min="0.01"
                      value={newTransaction.amount}
                      onChange={(e) => handleNewTransactionChange('amount', e.target.value)}
                      className="mt-1 block w-full rounded-xl border-0 bg-gray-800/60 py-2 px-3 text-gray-100 shadow-inner shadow-black/20 focus:ring-2 focus:ring-blue-500/50"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="type" className="block text-sm font-medium text-gray-300">
                      Type
                    </label>
                    <select
                      id="type"
                      value={newTransaction.type}
                      onChange={(e) => handleNewTransactionChange('type', e.target.value)}
                      className="mt-1 block w-full rounded-xl border-0 bg-gray-800/60 py-2 px-3 text-gray-100 shadow-inner shadow-black/20 focus:ring-2 focus:ring-blue-500/50"
                    >
                      <option value="expense">Dépense</option>
                      <option value="income">Revenu</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label htmlFor="category" className="block text-sm font-medium text-gray-300">
                    Catégorie
                  </label>
                  <select
                    id="category"
                    value={newTransaction.category}
                    onChange={(e) => handleNewTransactionChange('category', e.target.value)}
                    className="mt-1 block w-full rounded-xl border-0 bg-gray-800/60 py-2 px-3 text-gray-100 shadow-inner shadow-black/20 focus:ring-2 focus:ring-blue-500/50"
                    required
                  >
                    <option value="">-- Sélectionnez une catégorie --</option>
                    {(() => {
                      const { defaultCats, customCats } = getCategoriesForType(newTransaction.type as 'income' | 'expense');
                      return (
                        <>
                          {defaultCats.length > 0 && (
                            <optgroup label="Catégories par défaut">
                              {defaultCats.map((category) => (
                                <option key={`default-${category}`} value={category}>{category}</option>
                              ))}
                            </optgroup>
                          )}
                          {customCats.length > 0 && (
                            <optgroup label="Mes catégories personnalisées">
                              {customCats.map((category) => (
                                <option key={`custom-${category.id}`} value={category.name}>
                                  {category.icon ? `${category.icon} ` : ''}{category.name}
                                </option>
                              ))}
                            </optgroup>
                          )}
                        </>
                      );
                    })()}
                  </select>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label htmlFor="date" className="block text-sm font-medium text-gray-300">
                      Date
                    </label>
                    <input
                      type="date"
                      id="date"
                      value={newTransaction.date}
                      onChange={(e) => handleNewTransactionChange('date', e.target.value)}
                      className="mt-1 block w-full rounded-xl border-0 bg-gray-800/60 py-2 px-3 text-gray-100 shadow-inner shadow-black/20 focus:ring-2 focus:ring-blue-500/50"
                    />
                  </div>
                  <div>
                    <label htmlFor="paymentMethod" className="block text-sm font-medium text-gray-300">
                      Moyen de paiement
                    </label>
                    <select
                      id="paymentMethod"
                      value={newTransaction.paymentMethod}
                      onChange={(e) => handleNewTransactionChange('paymentMethod', e.target.value)}
                      className="mt-1 block w-full rounded-xl border-0 bg-gray-800/60 py-2 px-3 text-gray-100 shadow-inner shadow-black/20 focus:ring-2 focus:ring-blue-500/50"
                      required
                    >
                      <option value="">-- Sélectionnez un moyen de paiement --</option>
                      {paymentMethods.filter(m => m !== 'Tous les moyens').map((method) => (
                        <option key={method} value={method}>{method}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label htmlFor="frequency" className="block text-sm font-medium text-gray-300">
                    Fréquence
                  </label>
                  <select
                    id="frequency"
                    value={newTransaction.frequency}
                    onChange={(e) => handleNewTransactionChange('frequency', e.target.value)}
                    className="mt-1 block w-full rounded-xl border-0 bg-gray-800/60 py-2 px-3 text-gray-100 shadow-inner shadow-black/20 focus:ring-2 focus:ring-blue-500/50"
                  >
                    <option>unique</option>
                    <option>mensuel</option>
                    <option>trimestriel</option>
                    <option>annuel</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-between px-6 py-4 border-t border-gray-700/40 bg-gray-900/70">
                <button
                  type="button"
                  onClick={closeModal}
                  className="rounded-xl px-4 py-2 text-sm font-medium text-gray-300 transition hover:text-white"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 px-5 py-2 text-sm font-medium text-white shadow-lg shadow-blue-700/20 transition hover:from-blue-700 hover:to-purple-700"
                >
                  Enregistrer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      
      {/* Modal d'édition de transaction */}
      {showEditTransactionModal && editingTransaction && (
        <div className="fixed inset-0 z-10 overflow-y-auto" aria-labelledby="edit-modal-headline" role="dialog" aria-modal="true">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full" role="dialog" aria-modal="true" aria-labelledby="edit-modal-headline">
              <form onSubmit={handleUpdateTransaction} className="space-y-6">
                <div className="bg-gray-800/50 px-4 py-3 flex items-center justify-between border-b border-gray-700/30">
                  <h2 className="text-lg font-bold text-gray-100" id="edit-modal-headline">
                    Modifier la transaction
                  </h2>
                  <button type="button" onClick={closeEditModal} className="text-gray-400 hover:text-gray-300 transition-colors">
                    <XIcon size={16} />
                  </button>
                </div>
                <div className="p-6">
                  <div>
                    <label htmlFor="edit-name" className="block text-sm font-medium text-gray-300">
                      Nom de la transaction
                    </label>
                    <input 
                      type="text" 
                      id="edit-name" 
                      value={editingTransaction.name} 
                      onChange={(e) => setEditingTransaction({...editingTransaction, name: e.target.value})} 
                      className="mt-1 block w-full rounded-xl border-0 bg-gray-800/50 backdrop-blur-md py-2 px-3 text-gray-100 focus:ring-2 focus:ring-blue-500/50 shadow-md shadow-black/10" 
                    />
                  </div>
                  <div>
                    <label htmlFor="edit-amount" className="block text-sm font-medium text-gray-300">
                      Montant
                    </label>
                    <input 
                      type="number" 
                      id="edit-amount" 
                      value={Math.abs(editingTransaction.amount)} 
                      onChange={(e) => setEditingTransaction({...editingTransaction, amount: parseFloat(e.target.value) || 0})} 
                      className="mt-1 block w-full rounded-xl border-0 bg-gray-800/50 backdrop-blur-md py-2 px-3 text-gray-100 focus:ring-2 focus:ring-blue-500/50 shadow-md shadow-black/10" 
                    />
                  </div>
                  <div>
                    <label htmlFor="edit-type" className="block text-sm font-medium text-gray-300">
                      Type
                    </label>
                    <select 
                      id="edit-type" 
                      value={editingTransaction.type} 
                      onChange={(e) => setEditingTransaction({...editingTransaction, type: e.target.value, category: ''})} 
                      className="mt-1 block w-full rounded-xl border-0 bg-gray-800/50 backdrop-blur-md py-2 px-3 text-gray-100 focus:ring-2 focus:ring-blue-500/50 shadow-md shadow-black/10"
                    >
                      <option value="expense">Dépense</option>
                      <option value="income">Revenu</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="edit-category" className="block text-sm font-medium text-gray-300">
                      Catégorie
                    </label>
                    <select 
                      id="edit-category" 
                      value={editingTransaction.category} 
                      onChange={(e) => setEditingTransaction({...editingTransaction, category: e.target.value})} 
                      className="mt-1 block w-full rounded-xl border-0 bg-gray-800/50 backdrop-blur-md py-2 px-3 text-gray-100 focus:ring-2 focus:ring-blue-500/50 shadow-md shadow-black/10"
                    >
                      <option value="">-- Sélectionnez une catégorie --</option>
                      {(() => {
                        const { defaultCats, customCats } = getCategoriesForType(editingTransaction.type as 'income' | 'expense');
                        return (
                          <>
                            {defaultCats.length > 0 && (
                              <optgroup label="Catégories par défaut">
                                {defaultCats.map((category) => (
                                  <option key={`default-${category}`} value={category}>{category}</option>
                                ))}
                              </optgroup>
                            )}
                            {customCats.length > 0 && (
                              <optgroup label="Mes catégories personnalisées">
                                {customCats.map((category) => (
                                  <option key={`custom-${category.id}`} value={category.name}>
                                    {category.icon ? `${category.icon} ` : ''}{category.name}
                                  </option>
                                ))}
                              </optgroup>
                            )}
                          </>
                        );
                      })()}
                    </select>
                  </div>
                  <div>
                    <label htmlFor="edit-date" className="block text-sm font-medium text-gray-300">
                      Date
                    </label>
                    <input 
                      type="date" 
                      id="edit-date" 
                      value={editingTransaction.date} 
                      onChange={(e) => setEditingTransaction({...editingTransaction, date: e.target.value})} 
                      className="mt-1 block w-full rounded-xl border-0 bg-gray-800/50 backdrop-blur-md py-2 px-3 text-gray-100 focus:ring-2 focus:ring-blue-500/50 shadow-md shadow-black/10" 
                    />
                  </div>
                  <div>
                    <label htmlFor="edit-paymentMethod" className="block text-sm font-medium text-gray-300">
                      Moyen de paiement
                    </label>
                    <select 
                      id="edit-paymentMethod" 
                      value={editingTransaction.paymentMethod} 
                      onChange={(e) => setEditingTransaction({...editingTransaction, paymentMethod: e.target.value})} 
                      className="mt-1 block w-full rounded-xl border-0 bg-gray-800/50 backdrop-blur-md py-2 px-3 text-gray-100 focus:ring-2 focus:ring-blue-500/50 shadow-md shadow-black/10"
                    >
                      {paymentMethods.map(method => <option key={method}>{method}</option>)}
                    </select>
                  </div>
                  <div>
                    <label htmlFor="edit-frequency" className="block text-sm font-medium text-gray-300">
                      Fréquence
                    </label>
                    <select 
                      id="edit-frequency" 
                      value={editingTransaction.frequency} 
                      onChange={(e) => setEditingTransaction({...editingTransaction, frequency: e.target.value})} 
                      className="mt-1 block w-full rounded-xl border-0 bg-gray-800/50 backdrop-blur-md py-2 px-3 text-gray-100 focus:ring-2 focus:ring-blue-500/50 shadow-md shadow-black/10"
                    >
                      <option value="unique">Unique</option>
                      <option value="mensuel">Mensuel</option>
                      <option value="trimestriel">Trimestriel</option>
                      <option value="annuel">Annuel</option>
                    </select>
                  </div>
                </div>
                <div className="bg-gray-800/50 px-4 py-3 flex items-center justify-between border-t border-gray-700/30">
                  <button type="button" onClick={closeEditModal} className="text-gray-400 hover:text-gray-300 transition-colors">
                    Annuler
                  </button>
                  <button type="submit" className="inline-flex items-center rounded-xl bg-gradient-to-r from-green-600 to-emerald-600 px-4 py-2 text-sm font-medium text-white shadow-lg shadow-green-700/20 hover:from-green-700 hover:to-emerald-700 transition-all duration-200">
                    Mettre à jour
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </React.Fragment>
  );
};
export default TransactionManagement;
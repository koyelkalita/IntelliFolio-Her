"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import {
  buildPortfolio,
  getPortfolios,
  getPortfolio,
  updatePortfolio,
} from "@/lib/api";

const PortfolioContext = createContext();

export function PortfolioProvider({ children }) {
  const [portfolios, setPortfolios] = useState([]);
  const [currentPortfolio, setCurrentPortfolio] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Build a new portfolio from resume + GitHub
   */
  const createPortfolio = useCallback(
    async (resumeText, githubUsername, firebaseToken) => {
      setLoading(true);
      setError(null);

      try {
        const result = await buildPortfolio(
          resumeText,
          githubUsername,
          firebaseToken
        );

        if (result.status === "success") {
          setCurrentPortfolio(result);
          return result;
        } else {
          throw new Error(result.message || "Failed to create portfolio");
        }
      } catch (err) {
        const errorMsg = err.message || "Error creating portfolio";
        setError(errorMsg);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  /**
   * Fetch all user portfolios
   */
  const fetchPortfolios = useCallback(async (firebaseToken) => {
    setLoading(true);
    setError(null);

    try {
      const result = await getPortfolios(firebaseToken);
      setPortfolios(result || []);
      return result;
    } catch (err) {
      const errorMsg = err.message || "Error fetching portfolios";
      setError(errorMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Fetch single portfolio details
   */
  const fetchPortfolio = useCallback(
    async (portfolioId, firebaseToken) => {
      setLoading(true);
      setError(null);

      try {
        const result = await getPortfolio(portfolioId, firebaseToken);
        setCurrentPortfolio(result);
        return result;
      } catch (err) {
        const errorMsg = err.message || "Error fetching portfolio";
        setError(errorMsg);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  /**
   * Update portfolio
   */
  const updateCurrentPortfolio = useCallback(
    async (portfolioId, updates, firebaseToken) => {
      setLoading(true);
      setError(null);

      try {
        const result = await updatePortfolio(
          portfolioId,
          updates,
          firebaseToken
        );
        setCurrentPortfolio(result);
        return result;
      } catch (err) {
        const errorMsg = err.message || "Error updating portfolio";
        setError(errorMsg);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  /**
   * Clear current portfolio
   */
  const clearCurrentPortfolio = useCallback(() => {
    setCurrentPortfolio(null);
    setError(null);
  }, []);

  const value = {
    portfolios,
    currentPortfolio,
    loading,
    error,
    createPortfolio,
    fetchPortfolios,
    fetchPortfolio,
    updateCurrentPortfolio,
    clearCurrentPortfolio,
  };

  return (
    <PortfolioContext.Provider value={value}>
      {children}
    </PortfolioContext.Provider>
  );
}

export function usePortfolio() {
  const context = useContext(PortfolioContext);
  if (!context) {
    throw new Error("usePortfolio must be used within PortfolioProvider");
  }
  return context;
}

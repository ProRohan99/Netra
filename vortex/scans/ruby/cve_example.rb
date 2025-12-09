#!/usr/bin/env ruby
require 'json'
require 'net/http'
require 'uri'

# Example Ruby Exploit Script for Vortex Polyglot Engine
# Simulates checking for a CVE (e.g., CVE-2023-XXXX) by making a request
# and returning a structured JSON result.

target = ARGV[0]
if target.nil?
  puts JSON.generate({ error: "No target provided" })
  exit 1
end

# Make sure target has protocol
unless target.start_with?("http")
  target = "http://" + target
end

begin
  uri = URI.parse(target)
  response = Net::HTTP.get_response(uri)
  
  # Simulated Check Logic
  is_vulnerable = false
  details = "Target responded with #{response.code}"
  
  if response['server']&.downcase&.include?('outdated-server')
    is_vulnerable = true
    details = "Detected outdated server header"
  end

  result = {
    script: "cve_2023_example.rb",
    target: target,
    vulnerabilities: []
  }

  if is_vulnerable
    result[:vulnerabilities] << {
      type: "CVE-2023-EXAMPLE",
      severity: "High",
      details: details
    }
  end

  # For demonstration, we'll always return a "Low" info finding
  result[:vulnerabilities] << {
    type: "Ruby Engine Check",
    severity: "Info",
    details: "Ruby script executed successfully against #{target}"
  }

  puts JSON.generate(result)

rescue StandardError => e
  puts JSON.generate({ error: e.message })
end

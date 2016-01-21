<?php

require_once(__DIR__."/../utils/credentials.php");

class AuthenticatorService {

	private $queryMapper;
	private $modMapper;

	public function __construct($queryMapper, $modMapper) {
		$this->queryMapper = $queryMapper;
		$this->modMapper = $modMapper;
	}

	public function isValidSessionToken($token) {
		if (!isset($token)) {
			return false;
		}

		return $this->queryMapper->sessionIsValid($token);
	}

	public function authenticateTokenAgainstGoogle($token) {
		if ($token == null || $token == "") {
			throw new Exception("Bad token: $token");
		}

		$url = "https://www.googleapis.com/oauth2/v3/tokeninfo?id_token=".$token;
		$ch = curl_init("$url");
		curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
		curl_setopt($ch, CURLOPT_HEADER, 0);
		$data = curl_exec($ch);
		$dataDecoded = json_decode($data);
		curl_close($ch);
		$babyid = $this->authenticateEmailGetBabyId($dataDecoded->email);
		if (isset($babyid) && $babyid > 0) {
			return $this->generateSessionToken($babyid);
		}
		else {
			return null;
		}
	}

	/**
	 * Create a new session token for an authenticated user
	 */
	private function generateSessionToken($babyid) {
		$newtoken = uniqid (); //rand(PHP_INT_MIN, PHP_INT_MAX);
		$this->modMapper->cleanupExpiredTokens();
		$this->modMapper->saveToken($newtoken, $babyid);
		return $newtoken;
	}

	private function authenticateEmailGetBabyId($emailAddress) {
		// does it exist?
		$guardian = $this->queryMapper->getGuardianByEmailAddress($emailAddress);
		if (isset($guardian)) {
			$babyid = $guardian->baby->id;
			return $babyid;
		}
		else {
			return 0;
		}
	}
}
